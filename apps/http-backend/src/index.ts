import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });

    res.json({ userId: user.id });
  } catch (error) {
    res.status(411).json({
      message: "Error creating user:",
      error,
    });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
      password: parsedData.data.password,
    },
  });

  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
  }

  const token = jwt.sign(
    {
      userId: user?.id,
    },
    JWT_SECRET
  );

  res.status(200).json({
    token,
  });
});

app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  // @ts-ignore
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.status(200).json({
      room,
    });
  } catch (error) {
    res.status(411).json({
      message: "Error creating room:",
      error,
    });
  }
});

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;

  try {
    const room = await prismaClient.room.findFirst({
      where: {
        slug: slug,
      },
    });

    res.status(200).json({
      roomId: room?.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching room",
      error,
    });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);

  try {
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      take: 50,
      orderBy: {
        id: "desc",
      },
    });

    res.json({
      messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching messages",
      error,
    });
  }
});

app.listen(3001);
