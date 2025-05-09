"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../utils/socket";
import { newAssignedTaskReceived, updateTaskStatus } from "../redux/action";
import TaskRequestModal from "../components/taskRequestModal/page";

const AppWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [requestModal, setRequestModal] = useState({
    visible: false,
    task: null,
    from: "",
  });

useEffect(() => {
  if (user?._id) {
    console.log("Initializing socket for user:", user._id);
    
    socket.on("taskRequest", (data) => {
      console.log("RECEIVED TASK REQUEST DATA:", data);
      console.log("Should show modal?", data.requiresAction);
      setRequestModal({
        visible: true,
        task: data.task,
        from: data.from,
        message: data.message
      });
    });

    socket.on("taskAssigned", (data) => {
      console.log("RECEIVED DIRECT ASSIGNMENT:", data);
      dispatch(newAssignedTaskReceived(data.task));
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
  }
}, [user]);

  const handleRequestResponse = (response) => {
    socket.emit("respondToTaskRequest", {
      taskId: requestModal.task._id,
      response,
      userId: user._id,
    });
    setRequestModal({ ...requestModal, visible: false });
  };

  return (
    <>
      {children}
      <TaskRequestModal
        visible={requestModal.visible}
        from={requestModal.from}
        message={requestModal.message}
        onAccept={() => handleRequestResponse("accept")}
        onReject={() => handleRequestResponse("reject")}
        onClose={() => setRequestModal({ ...requestModal, visible: false })}
      />
    </>
  );
};

export default AppWrapper;
