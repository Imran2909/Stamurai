"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List, Button, Typography, Empty, message } from "antd";
import { editAssignedTask, getAssignedTasks } from "../../redux/action";
import socket from "../../socket/socket";
import styles from "../../styles/taskRequests.module.css";

const { Text } = Typography;

const TaskRequests = () => {
  const dispatch = useDispatch();

  // Grab task requests and username from Redux state
  const requests = useSelector(
    (state) => state.assignTask.assignedTasks.requests || []
  );
  const username = useSelector((state) => state.user.username);

  // Fetch assigned tasks on mount (and whenever dispatch changes, which it won't)
  useEffect(() => {
    dispatch(getAssignedTasks());
  }, [dispatch]);

  // Handle accepting a task request
  const handleAccept = async (task) => {
    const taskId = task._id;
    const updates = { ...task, assignStatus: "assigned" };

    // Update task status in backend/store
    await dispatch(editAssignedTask(taskId, updates));

    // Notify sender through socket that request was accepted
    socket.emit("accept-task", {
      from: task.sentBy.username,
      to: username,
      status: "requested",
      task,
    });

    // Refresh assigned tasks to reflect change
    dispatch(getAssignedTasks());
  };

  // Handle rejecting a task request
  const handleReject = async (task) => {
    const taskId = task._id;
    const updates = { ...task, assignStatus: "rejected" };

    // Update task status in backend/store
    await dispatch(editAssignedTask(taskId, updates));

    // Notify sender that request was rejected
    socket.emit("reject-task", {
      from: task.sentBy.username,
      to: username,
      status: "requested",
      task,
    });

    // Show a little warning toast for feedback
    message.warning(`${task.title} is rejected`);

    // Refresh assigned tasks again
    dispatch(getAssignedTasks());
  };

  return (
    <div className={styles.wrapper}>
      <h2>Task Requests</h2>

      {requests.length === 0 ? (
        // Show friendly empty state if no requests
        <Empty description="No pending task requests" />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={requests}
          renderItem={(task) => (
            <List.Item
              className={styles.requestItem}
              actions={[
                <>
                  <Button
                    className={styles.button}
                    type="primary"
                    size="medium"
                    onClick={() => handleAccept(task)}
                  >
                    Accept
                  </Button>
                  <Button
                    className={styles.button}
                    danger
                    size="medium"
                    onClick={() => handleReject(task)}
                  >
                    Reject
                  </Button>
                </>,
              ]}
            >
              <List.Item.Meta
                title={
                  <p className={styles.title}>
                    {task.sentBy?.username} requested you a new task
                  </p>
                }
                description={
                  <>
                    <Text type="secondary">{task.title}</Text>
                    <br />
                    <Text type="secondary">
                      Priority: {task.priority}, Due:{" "}
                      {new Date(task.dueDate).toLocaleDateString()}
                    </Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default TaskRequests;
