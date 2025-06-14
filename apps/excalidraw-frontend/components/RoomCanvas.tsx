"use client";

import { WS_URL } from "@/app/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjZTFjMjU1Ni1lMWRhLTRlMzYtODJiOC1iMzZhY2JlNjgyMzAiLCJpYXQiOjE3NDk3ODg1MDZ9.1YJjgb_wF9nJeUslEUozvdTJSGQa1mhCwEWYFcObz9U`
    );
    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({ type: "join_room", roomId }));
    };
    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Canvas dimensions={dimensions} roomId={roomId} socket={socket} />
    </div>
  );
}
