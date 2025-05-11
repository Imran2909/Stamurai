"use client";
import { message } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import socket from "../socket/socket";

const AppWrapper = ({ children }) => {
  const username = useSelector((store) => store.user.username);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ [CLIENT] You have joined");
      // Add this line to join the user's personal room
      socket.emit("join", username);
    });

    socket.on("new_user_joined", () => {
      console.log("🎉 [CLIENT] New user joined");
    });

    socket.on("disconnect", () => {
      console.log("❌ [CLIENT] Disconnected");
    });

    socket.on("task-assign", (data) => {
      console.log(" AW 📥 New task assigned to you: ", data);
    });

    return () => {
      socket.off("connect");
      socket.off("new_user_joined");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [username]); // Add username as dependency

  return <>{children}</>;
};

export default AppWrapper;



