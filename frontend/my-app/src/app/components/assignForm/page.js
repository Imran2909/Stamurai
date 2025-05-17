"use client";
import React, { useState } from "react";
import styles from "../../styles/assignForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { assignTask } from "../../redux/action";
import { message } from "antd";
import socket from "../../socket/socket";

const AssignForm = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((store) => store.user.username);
  const [messageApi, contextHolder] = message.useMessage();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    priority: "medium",
    status: "pending",
    frequency: "once",
    sendTo: "",
  });

  // Handle form field updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentUser === formData.sendTo.trim()) {
      messageApi.error("You cannot assign a task to yourself.");
      return;
    }

    try {
      const result = await dispatch(assignTask(formData));

      if (result?.error) {
        messageApi.error(result.error);
      } else if (result?.task) {
        messageApi.success(result.message);

        // Emit socket event to notify receiver
        socket.emit("task-assign", {
          from: currentUser,
          to: formData.sendTo.trim(),
          status: result.status,
          id: result.task._id,
        });
      }
    } catch (err) {
      console.error("Task assignment error:", err);
      messageApi.error("Failed to assign task.");
    }
  };

  return (
    <>
      {contextHolder}
      <form className={styles.assignForm} onSubmit={handleSubmit}>
        {/* Top Row: Username & Title */}
        <div className={styles.firstBox}>
          <div className={styles.formGroup1}>
            <label htmlFor="sendTo">Assign To (Username)</label>
            <input
              type="text"
              id="sendTo"
              name="sendTo"
              placeholder="e.g. johndoe"
              value={formData.sendTo}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup1}>
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Due Date & Time */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dueTime">Due Time</label>
            <input
              type="time"
              id="dueTime"
              name="dueTime"
              value={formData.dueTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Priority, Status, Frequency */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="frequency">Frequency</label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
            >
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <button type="submit" className={styles.assignButton}>
          Assign Task
        </button>
      </form>
    </>
  );
};

export default AssignForm;
