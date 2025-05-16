"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../socket/socket";
import { message, Modal } from "antd";
import { getAssignedTasks } from "../redux/action";

const AppWrapper = ({ children }) => {
  const username = useSelector((store) => store.user.username);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestInfo, setRequestInfo] = useState(null);
  const [info, setInfo] = useState({});
  const dispatch = useDispatch()

  const handleOk = () => {
    setIsModalOpen(false);
    // Emit "accept-task" event to server (if needed)
    socket.emit("accept-task", info);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    // Emit "reject-task" event to server (if needed)
    console.log("reject-taskkkkkkkkkkkkkkkkk");
    socket.emit("reject-task", info);
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
      //from, to, status, data
      if (data.status === "assigned") {
        setInfo(data);
        messageApi.success("✅ A task has been assigned to you!");
      }
      if (data.status === "requested") {
        setInfo(data);
        console.log("📩 Task request received:", data);
        setRequestInfo(data); // Save info for modal
        setIsModalOpen(true); // Show modal
      }
    });

    socket.on("taskRequestSuccess", (data) => {
      messageApi.success(data.message);
    });

    socket.on("taskRequestReject", (data) => {
      messageApi.error(data.message);
    });

    socket.on("Delete-task", (data) => {
      if (data.to == username) {
        messageApi.warning(
          `${data.deletedTask.title} task is deleted by ${data.doneBy}` );
        dispatch(getAssignedTasks()); // 🔄 Refresh tasks for all 
      }
    });
    socket.on("Update-task", (data) => {
      if (data.to == username) {
        console.log(data)
        let actions = data.status ? data.status : "updated"
        console.log(actions)
        messageApi.warning(
          ` ${data.task.title} task is updated by ${data.doneBy}`
        );
        dispatch(getAssignedTasks());
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("task-assign");
      socket.off("new_user_joined");
      socket.off("taskRequestReject");
      socket.disconnect();
    };
  }, [dispatch,username]);

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
