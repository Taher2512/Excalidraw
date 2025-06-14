import { BACKEND_URL } from "@/app/config";
import axios from "axios";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      radius: number;
    };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  let existingShapes: Shape[] = await getExistingShapes(roomId);

  socket.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);
    if (parsedData.type === "chat") {
      existingShapes.push(JSON.parse(parsedData.message));
    }

    clearCanvas(existingShapes, canvas, ctx);
  };

  clearCanvas(existingShapes, canvas, ctx);

  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let width = 0;
  let height = 0;

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
    isDrawing = false;
    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    };
    existingShapes.push(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        roomId: Number(roomId),
        message: JSON.stringify(shape),
      })
    );
  });

  canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      width = e.clientX - startX;
      height = e.clientY - startY;
      clearCanvas(existingShapes, canvas, ctx);
      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgb(255, 255, 255)";

  existingShapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
    }
  });
}

async function getExistingShapes(roomId: string): Promise<Shape[]> {
  const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
  const messages = res.data.messages;

  let shapes: Shape[] = [];

  messages.map((x: { message: string }) => {
    shapes.push(JSON.parse(x.message));
  });

  return shapes;
}
