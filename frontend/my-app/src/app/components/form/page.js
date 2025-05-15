"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/form.module.css";
import { useDispatch } from "react-redux";
import { createTask, updateTask } from "../../redux/action";
import { message } from "antd";

export default function Form({ task = null, onSuccess, onClose, onUpdate }) {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const isEditing = Boolean(task);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    priority: "medium",
    frequency: "once",
    status: "pending",
  });

  useEffect(() => {
    if (task) {
      const formatDate = (dateStr) => dateStr?.split("T")[0] || "";
      const formatTime = (timeStr) => {
        // Ensure HH:MM 24-hour format
        if (!timeStr) return "";
        if (timeStr.includes("AM") || timeStr.includes("PM")) {
          const [time, modifier] = timeStr.split(" ");
          let [hours, minutes] = time.split(":");
          if (hours === "12") hours = "00";
          if (modifier === "PM") hours = String(parseInt(hours, 10) + 12);
          return `${hours.padStart(2, "0")}:${minutes}`;
        }
        return timeStr.slice(0, 5); // crop to HH:MM if longer
      };

      setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: formatDate(task.dueDate),
        dueTime: formatTime(task.dueTime),
        priority: task.priority || "medium",
        frequency: task.frequency || "once",
        status: task.status || "pending",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        const result = await dispatch(updateTask(task._id, formData));
        if (result?.payload) {
          messageApi.success("Task updated successfully");
          setTimeout(() => {
            onClose?.();
          }, 2500); // Wait 500ms to allow message to show
          return;
        }
      } else {
        const result = await dispatch(createTask(formData));
        console.log(result.success);
        if (result.success) {
          onClose?.();
          setTimeout(() => {
            messageApi.success("Task created successfully");
          }, 2500);
          return;
        }
      }
    } catch (error) {
      messageApi.error(error.message || "Operation failed");
    }
  };

  return (
    <div className={styles.formContainer}>
      {contextHolder}
      <h2 className={styles.formTitle}>
        {isEditing ? "Edit Task" : "Create a New Task"}
      </h2>

      <form onSubmit={handleSubmit} className={styles.taskForm}>
        {/* Title */}
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.inputLabel}>
            Title
          </label>
          <input
            type="text"
            id="title"
            className={styles.textInput}
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.inputLabel}>
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            className={styles.textArea}
            onChange={handleChange}
            rows={4}
          />
        </div>

        {/* Due Date and Time */}
        <div className={styles.dateTimeGroup}>
          <div className={styles.formGroup}>
            <label htmlFor="dueDate" className={styles.inputLabel}>
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={styles.dateInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dueTime" className={styles.inputLabel}>
              Due Time
            </label>
            <input
              type="time"
              id="dueTime"
              value={formData.dueTime}
              onChange={handleChange}
              className={styles.timeInput}
            />
          </div>
        </div>

        {/* Priority, Frequency, Status */}
        <div className={styles.selectGroup}>
          <div className={styles.formGroup}>
            <label htmlFor="priority" className={styles.inputLabel}>
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={handleChange}
              className={styles.selectInput}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="frequency" className={styles.inputLabel}>
              Frequency
            </label>
            <select
              id="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className={styles.selectInput}
            >
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.inputLabel}>
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.selectInput}
            >
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          {isEditing ? "Update Task" : "Create Task"}
        </button>
      </form>
    </div>
  );
}
