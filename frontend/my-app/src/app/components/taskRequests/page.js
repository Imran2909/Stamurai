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
  const requests = useSelector(
    (state) => state.assignTask.assignedTasks.requests || []
  );
  console.log(requests)
  const username = useSelector((state) => state.user.username);

  useEffect(() => {
    dispatch(getAssignedTasks()); // Refresh after accept
  }, [dispatch,useSelector]);

  const handleAccept = async (task) => {
    let taskId = task._id;
    let updates = {
      ...task,
      assignStatus: "assigned",
    };
    console.log(updates);
    await dispatch(editAssignedTask(taskId, updates)).then(() => {
      const info = {
        from: task.sentBy.username,
        to: username,
        status: "requested",
        task,
      };
      socket.emit("accept-task", info);
    });
    dispatch(getAssignedTasks()); // Refresh after accept
  };

  const handleReject = async (task) => {
    console.log(task);
    let taskId = task._id;
    let updates = {
      ...task,
      assignStatus: "rejected",
    };
    await dispatch(editAssignedTask(taskId, updates)).then(() => {
      const info = {
        from: task.sentBy.username,
        to: username,
        status: "requested",
        task,
      };
      socket.emit("reject-task", info);
    });
    message.warning(`${task.title} is rejected`)
    console.log(updates);
    dispatch(getAssignedTasks()); // Refresh after accept
  };

  return (
    <div className={styles.wrapper}>
      <h2>Task Requests</h2>

      {requests?.length === 0 ? (
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
                  <Text>
                    <strong>{task.sentBy?.username}</strong> requested you to
                    accept a task.
                  </Text>
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
