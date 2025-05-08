"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask } from "../../redux/action";
import { Modal, message } from "antd";
import styles from "../../styles/table.module.css";
import Form from "../form/page";

const formatDateTime = (dateStr, timeStr) => {
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") hours = "00";
    if (modifier === "PM") hours = parseInt(hours, 10) + 12;
    return `${hours}:${minutes}`;
  };

  const datePart = dateStr.split("T")[0];
  const timePart =
    timeStr.includes("AM") || timeStr.includes("PM")
      ? convertTo24Hour(timeStr)
      : timeStr;

  try {
    const date = new Date(`${datePart}T${timePart}`);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).replace(",", "");
  } catch (e) {
    console.error("Date formatting error:", e);
    return "Invalid Date";
  }
};

export default function Table({ filter = "all" }) {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { 
    tasks: allTasks, 
    loading, 
    error,
    searchQuery,
    priorityFilter,
    statusFilter,
    dueDateFilter
  } = useSelector((state) => state.task);
  const token = useSelector((store) => store.user.token);  
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);


  const getFilteredTasks = (filterType, tasksList) => {
    const now = new Date();
  
    const toValidDate = (dateStr, timeStr) => {
      const convertTo24Hour = (time12h) => {
        const [time, modifier] = time12h.split(" ");
        let [hours, minutes] = time.split(":");
        if (hours === "12") hours = "00";
        if (modifier === "PM") hours = String(parseInt(hours, 10) + 12);
        return `${hours}:${minutes}`;
      };
  
      const datePart = dateStr.split("T")[0];
      const timePart =
        timeStr.includes("AM") || timeStr.includes("PM")
          ? convertTo24Hour(timeStr)
          : timeStr;
  
      return new Date(`${datePart}T${timePart}`);
    };
  
    // First apply all filters except sorting
    let filtered = tasksList.filter((task) => {
      // Apply search filter
      if (searchQuery && searchQuery.trim() !== "") {
        const matchesSearch = 
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
      }
  
      // Apply priority filter
      if (priorityFilter && task.priority.toLowerCase() !== priorityFilter.toLowerCase()) {
        return false;
      }
  
      // Apply status filter
      if (statusFilter && task.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
  
      const due = toValidDate(task.dueDate, task.dueTime);
      if (isNaN(due.getTime())) return false;
  
      // Apply main filter (all/overdue)
      if (filterType === "overdue") {
        return due < now;
      }
      return due >= now;
    });
  
    // Then apply sorting if needed
    if (dueDateFilter === "asc" || dueDateFilter === "desc") {
      filtered = [...filtered].sort((a, b) => {
        const dateA = toValidDate(a.dueDate, a.dueTime);
        const dateB = toValidDate(b.dueDate, b.dueTime);
        return dueDateFilter === "asc" 
          ? dateA - dateB 
          : dateB - dateA;
      });
    }
  
    return filtered;
  };


  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (allTasks.length) {
      setFilteredTasks(getFilteredTasks(filter, allTasks));
      console.log(getFilteredTasks(filter, allTasks))
    }
  }, [allTasks, filter, searchQuery, priorityFilter, statusFilter, dueDateFilter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFilteredTasks(getFilteredTasks(filter, allTasks));
    }, 1000);
    return () => clearInterval(interval);
  }, [filter, allTasks, searchQuery, priorityFilter, statusFilter, dueDateFilter]);

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

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      const res = await dispatch(deleteTask(deleteId, token));
      res === "deleted" ? successToast() : failToast();
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
      {contextHolder}
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>
            {filter === "all" ? "My Tasks" : "Overdue Tasks"}
          </h2>
        </div>

        {filter === "all" && (
          <button
            className={styles.addButton}
            onClick={() => setIsFormOpen(true)}
          >
            Add Task
          </button>
        )}
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
            ) : filteredTasks.length === 0 && !loading && !error ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  {filter === "overdue"
                    ? "No overdue tasks!"
                    : "No tasks found. Start by adding a task!"}
                </td>
              </tr>
            ) : (
              filteredTasks.map((task, index) => (
                <tr key={task._id || index}>
                  <td>{index + 1}</td>
                  <td className={styles.description}>{task.title}</td>
                  <td className={styles.description}>{task.description}</td>
                  <td>{formatDateTime(task.dueDate, task.dueTime)}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${styles[task.priority.toLowerCase()]}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${styles[task.status.replace(" ", "").toLowerCase()]}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>{task.frequency}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.edit}
                        onClick={() => {
                          setEditTask(task);
                          setIsFormOpen(true);
                        }}
                      >
                        ✏️
                      </button>
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

      <Modal
        open={isModalOpen}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to Delete this task?</p>
      </Modal>

      {isFormOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.close}
              onClick={() => {
                setIsFormOpen(false);
                setEditTask(null);
              }}
            >
              ×
            </button>
            <Form
              task={editTask}
              onClose={() => {
                setIsFormOpen(false);
                setEditTask(null);
              }}
              onSuccess={() => setIsFormOpen(false)}
              onUpdate={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}