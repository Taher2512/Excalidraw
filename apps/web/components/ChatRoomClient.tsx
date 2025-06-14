"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../app/hooks/useSocket";

export function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const [chats, setChats] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");
  const { socket, loading } = useSocket();

  useEffect(() => {
    if (socket && !loading) {
      socket.send(JSON.stringify({ type: "join_room", roomId: id }));

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChats((prevChats) => [
            ...prevChats,
            { message: parsedData.message },
          ]);
        }
      };
    }

    return () => {
      socket?.close();
    };
  }, [socket, loading, id]);

  return (
    <div style={{ padding: "100px", maxWidth: "600px", margin: "0 auto" }}>
      {chats.map((chat, index) => (
        <div key={index}>{chat.message}</div>
      ))}

      <input
        type="text"
        placeholder="Enter message..."
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message: currentMessage,
            })
          );
        }}
      >
        Send Message
      </button>
    </div>
  );
}
