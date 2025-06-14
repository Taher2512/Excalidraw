import { BACKEND_URL } from "@/app/config";
import axios from "axios";
import { Shape } from "./Game";

export async function getExistingShapes(roomId: string): Promise<Shape[]> {
  const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
  const messages = res.data.messages;

  let shapes: Shape[] = [];

  messages.map((x: { message: string }) => {
    shapes.push(JSON.parse(x.message));
  });

  return shapes;
}
