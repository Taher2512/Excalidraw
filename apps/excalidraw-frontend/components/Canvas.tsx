"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export function Canvas({
  dimensions,
  roomId,
  socket,
}: {
  dimensions: { width: number; height: number };
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket);
    }
  }, [canvasRef]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ width: "100%", height: "100%" }}
      ></canvas>
    </div>
  );
}
