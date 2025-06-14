import { WebSocket } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocket.Server({ port: 8080 });

interface User {
  userId: string;
  rooms: string[];
  ws: WebSocket;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

wss.on("connection", (ws: WebSocket, req) => {
  const url = req.url;

  if (!url) {
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") as string;
  const userId = checkUser(token);

  if (userId == null) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message", async (message) => {
    let parsedData;
    if (typeof message !== "string") {
      parsedData = JSON.parse(message.toString());
    } else {
      parsedData = JSON.parse(message);
    }

    if (parsedData.type === "join_room") {
      const roomId = parsedData.roomId;
      const user = users.find((x) => x.ws == ws);
      user?.rooms.push(roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws == ws);
      if (!user) return;
      user.rooms =
        user?.rooms.filter((roomId) => roomId !== parsedData.roomId) || [];
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      try {
        console.log("here1");

        await prismaClient.chat.create({
          data: {
            userId,
            message,
            roomId,
          },
        });
        console.log("here2");
      } catch (error) {
        console.log("here3");

        console.error("Error saving chat message:", error);
        return;
      }

      users.forEach((user) => {
        if (user.rooms.includes(roomId.toString())) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message.toString(),
              roomId,
            })
          );
        }
      });
    }
  });
});
