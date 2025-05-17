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
  const dispatch = useDispatch();

  // Accept task assignment request
  const handleOk = () => {
    setIsModalOpen(false);
    socket.emit("accept-task", info);
  };

  // Reject task assignment request
  const handleCancel = () => {
    setIsModalOpen(false);
    socket.emit("reject-task", info);
  };

  useEffect(() => {
    if (!username) return; // Wait until username is ready

    socket.connect();

    socket.on("connect", () => {
      socket.emit("join", username); // Join socket room by username
    });

    // Event: New user joined - could be used to update UI if needed
    socket.on("new_user_joined", ({ username: joinedUser }) => {
      if (joinedUser !== username) {
        // You can add logic here if you want to notify about new users
      }
    });

    socket.on("disconnect", () => {
      // Optional: Handle disconnect if needed
    });

    // Task assigned or requested from another user
    socket.on("task-assign", (data) => {
      if (data.status === "assigned") {
        setInfo(data);
        messageApi.success("✅ A task has been assigned to you!");
      }
      if (data.status === "requested") {
        setInfo(data);
        setRequestInfo(data);
        setIsModalOpen(true); // Show modal for acceptance/rejection
      }
    });

    // Task request accepted successfully
    socket.on("taskRequestSuccess", (data) => {
      messageApi.success(data.message);
    });

    // Task request rejected
    socket.on("taskRequestReject", (data) => {
      messageApi.error(data.message);
    });

    // A task was deleted by someone else
    socket.on("Delete-task", (data) => {
      if (data.to === username) {
        messageApi.warning(
          `${data.deletedTask.title} task is deleted by ${data.doneBy}`
        );
        dispatch(getAssignedTasks()); // Refresh assigned tasks list
      }
    });

    // A task was updated by someone else
    socket.on("Update-task", (data) => {
      if (data.to === username) {
        const actionText = data.act ?? "updated";
        messageApi.warning(
          `${data.task.title} task is ${actionText} by ${data.doneBy}`
        );
        dispatch(getAssignedTasks());
      }
    });

    // Cleanup listeners on unmount or username change
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("task-assign");
      socket.off("new_user_joined");
      socket.off("taskRequestSuccess");
      socket.off("taskRequestReject");
      socket.off("Delete-task");
      socket.off("Update-task");
      socket.disconnect();
    };
  }, [dispatch, username, messageApi]);

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
