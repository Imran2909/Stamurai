"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";

// 🔄 Persistent socket instance
const socket = io("http://localhost:5000", {
  autoConnect: false,
  withCredentials: true,
});

const AppWrapper = ({ children }) => {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ [CLIENT] You have joined");
    });

    socket.on("new_user_joined", () => {
      console.log("🎉 [CLIENT] New user joined");
    });

    socket.on("disconnect", () => {
      console.log("❌ [CLIENT] Disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("new_user_joined");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  return <>{children}</>;
};

export default AppWrapper;
