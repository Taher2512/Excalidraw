import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>();

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjZTFjMjU1Ni1lMWRhLTRlMzYtODJiOC1iMzZhY2JlNjgyMzAiLCJpYXQiOjE3NDk3ODg1MDZ9.1YJjgb_wF9nJeUslEUozvdTJSGQa1mhCwEWYFcObz9U`
    );
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return {
    loading,
    socket,
  };
}
