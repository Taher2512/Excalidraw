import { RoomCanvas } from "@/components/RoomCanvas";

export default async function CanvasPage({
  params,
}: {
  params: { roomId: string };
}) {
  const { roomId } = await params;

  return <RoomCanvas roomId={roomId} />;
}
