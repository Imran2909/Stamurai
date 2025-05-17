"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/form.module.css";
import { useDispatch } from "react-redux";
import { createTask, updateTask } from "../../redux/action";
import { message } from "antd";

// Main form component for creating or editing a task
export default function Form({ task = null, onSuccess, onClose, onUpdate }) {
  const dispatch = useDispatch();

  // Ant Design's message API for toast-style notifications
  const [messageApi, contextHolder] = message.useMessage();

  // If a task is passed in, we're editing; otherwise, creating new
  const isEditing = Boolean(task);

  // Local state to hold form inputs
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    priority: "medium",
    frequency: "once",
    status: "pending",
  });

  // Populate form with task data when editing
  useEffect(() => {
    if (task) {
      // Format date string to yyyy-mm-dd (for <input type="date" />)
      const formatDate = (dateStr) => dateStr?.split("T")[0] || "";

      // Format time string to HH:mm in 24-hour format
      const formatTime = (timeStr) => {
        if (!timeStr) return "";
        if (timeStr.includes("AM") || timeStr.includes("PM")) {
          const [time, modifier] = timeStr.split(" ");
          let [hours, minutes] = time.split(":");
          if (hours === "12") hours = "00";
          if (modifier === "PM") hours = String(parseInt(hours, 10) + 12);
          return `${hours.padStart(2, "0")}:${minutes}`;
        }
        return timeStr.slice(0, 5); // Fallback for already 24hr string
      };

      // Set form with prefilled values
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

  // Handler to update form fields
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Submit handler for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Update existing task
        const result = await dispatch(updateTask(task._id, formData));
        if (result?.payload) {
          onClose?.(); // Optional close modal
          setTimeout(() => {
            messageApi.success("Task updated successfully");
          }, 500);
          return;
        }
      } else {
        // Create new task
        const result = await dispatch(createTask(formData));
        if (result.success) {
          onClose?.();
          setTimeout(() => {
            messageApi.success("Task created successfully");
          }, 500);
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
        {/* Title field */}
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.inputLabel}>Title</label>
          <input
            type="text"
            id="title"
            className={styles.textInput}
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description field */}
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.inputLabel}>Description</label>
          <textarea
            id="description"
            value={formData.description}
            className={styles.textArea}
            onChange={handleChange}
            rows={4}
          />
        </div>

        {/* Due date & time */}
        <div className={styles.dateTimeGroup}>
          {/* Date input */}
          <div className={styles.formGroup}>
            <label htmlFor="dueDate" className={styles.inputLabel}>Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={styles.dateInput}
              required
            />
          </div>

          {/* Time input */}
          <div className={styles.formGroup}>
            <label htmlFor="dueTime" className={styles.inputLabel}>Due Time</label>
            <input
              type="time"
              id="dueTime"
              value={formData.dueTime}
              onChange={handleChange}
              className={styles.timeInput}
            />
          </div>
        </div>

        {/* Priority / Frequency / Status dropdowns */}
        <div className={styles.selectGroup}>
          {/* Priority */}
          <div className={styles.formGroup}>
            <label htmlFor="priority" className={styles.inputLabel}>Priority</label>
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

          {/* Frequency */}
          <div className={styles.formGroup}>
            <label htmlFor="frequency" className={styles.inputLabel}>Frequency</label>
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

          {/* Status */}
          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.inputLabel}>Status</label>
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

        {/* Final submit button */}
        <button type="submit" className={styles.submitButton}>
          {isEditing ? "Update Task" : "Create Task"}
        </button>
      </form>
    </div>
  );
}
