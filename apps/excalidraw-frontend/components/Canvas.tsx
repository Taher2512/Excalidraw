"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "pencil";

export function Canvas({
  dimensions,
  roomId,
  socket,
}: {
  dimensions: { width: number; height: number };
  roomId: string;
  socket: WebSocket;
}) {
  const [selectedTool, setSelectedTool] = useState<Tool>("pencil");
  const [game, setGame] = useState<Game>();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
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
      <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}

function Topbar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
}) {
  return (
    <div className="absolute top-5 left-1/2 flex gap-5 -translate-x-1/2 bg-slate-300 p-2 rounded-lg shadow-md">
      <IconButton
        icon={<Pencil />}
        onClick={() => {
          setSelectedTool("pencil");
        }}
        isActive={selectedTool === "pencil"}
      />
      <IconButton
        icon={<RectangleHorizontalIcon />}
        onClick={() => {
          setSelectedTool("rect");
        }}
        isActive={selectedTool === "rect"}
      />
      <IconButton
        icon={<Circle />}
        onClick={() => {
          setSelectedTool("circle");
        }}
        isActive={selectedTool === "circle"}
      />
    </div>
  );
}
