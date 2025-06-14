"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("");

  const router = useRouter();

  return (
    <div className={styles.page}>
      <input
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={() => router.push(`/room/${roomId}`)}>Join Room</button>
    </div>
  );
}
