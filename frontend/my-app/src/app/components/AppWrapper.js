"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socket from "../socket/socket";
import { message, Modal } from "antd";

const AppWrapper = ({ children }) => {
  const username = useSelector((store) => store.user.username);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestInfo, setRequestInfo] = useState(null);

  const handleOk = () => {
    setIsModalOpen(false);
    // Emit "accept-task" event to server (if needed)
    socket.emit("accept-task", { from: requestInfo.from });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    // Emit "reject-task" event to server (if needed)
    socket.emit("reject-task", { from: requestInfo.from });
  };
  
  useEffect(() => {
    if (!username) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ [CLIENT] You have joined");
      socket.emit("join", username);
    });

    // ✅ Handle new user joined event
    socket.on("new_user_joined", ({ username: joinedUser }) => {
      if (joinedUser !== username) {
        console.log("🎉 [CLIENT] New user joined:", joinedUser);
        messageApi.info(`${joinedUser} joined the platform`);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ [CLIENT] Disconnected");
    });

    socket.on("task-assign", (data) => {
      if (data.status === "assigned") {
        messageApi.success("✅ A task has been assigned to you!");
      }
      if (data.status === "requested") {
         console.log("📩 Task request received:", data);
        setRequestInfo(data); // Save info for modal
        setIsModalOpen(true); // Show modal
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("task-assign");
      socket.off("new_user_joined");
      socket.disconnect();
    };
  }, [username]);

  return (
    <>
      {contextHolder}
      {children}
       <Modal
        title="Task Assignment Request"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Accept"
        cancelText="Reject"
      >
        <p>{requestInfo?.from} wants to assign you a task.</p>
      </Modal>
    </>
  );
};

export default AppWrapper;
