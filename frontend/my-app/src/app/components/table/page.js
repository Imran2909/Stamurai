"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask } from "../../redux/action";
import { Modal } from "antd"; // AntD modal
import styles from "../../styles/table.module.css";
import Form from "../form/page";
import { Button, message, Space } from "antd";

const formatDateTime = (dateStr, timeStr) => {
  const date = new Date(`${dateStr}T${timeStr}`);
  return date
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "");
};

export default function Table() {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { tasks, loading, error } = useSelector((state) => state.task);
  const token = useSelector((store) => store.user.token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const successToast = () => {
    messageApi.open({
      type: "success",
      content: "✅ Task deleted successfully.",
    });
  };
  const failToast = () => {
    messageApi.open({
      type: "error",
      content: "❌ Failed to delete task.",
    });
  };

  const handleDelete = async () => {
    if (deleteId) {
      const res = await dispatch(deleteTask(deleteId, token));
      if (res == "deleted") {
        successToast();
      } else if (res == "failed") {
        failToast()
      }
    }
    setIsModalOpen(false);
    setDeleteId(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setDeleteId(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>My Tasks</h2>
        <button
          className={styles.addButton}
          onClick={() => setIsFormOpen(true)}
        >
          Add Task
        </button>
      </div>

      {loading && <p>Loading tasks...</p>}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Title</th>
              <th>Description</th>
              <th>Due On</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Frequency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {error === "Unauthorized" ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", color: "red" }}>
                  You are not authorized. Please log in to view your tasks.
                </td>
              </tr>
            ) : tasks.length === 0 && !loading && !error ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No tasks found. Start by adding a task!
                </td>
              </tr>
            ) : (
              tasks.map((task, index) => (
                <tr key={task._id || index}>
                  <td>{index + 1}</td>
                  <td>{task.title}</td>
                  <td className={styles.description}>{task.description}</td>
                  <td>{formatDateTime(task.dueDate, task.dueTime)}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        styles[task.priority.toLowerCase()]
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        styles[task.status.replace(" ", "").toLowerCase()]
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>{task.frequency}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.edit}>✏️</button>
                      <button
                        className={styles.delete}
                        onClick={() => confirmDelete(task._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        open={isModalOpen}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to Delete this task?</p>
      </Modal>

      {/* Add task modal */}
      {isFormOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.close}
              onClick={() => setIsFormOpen(false)}
            >
              ×
            </button>
            <Form />
          </div>
        </div>
      )}
    </div>
  );
}
