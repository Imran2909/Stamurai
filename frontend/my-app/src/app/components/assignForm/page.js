"use client";
import React, { useState, useEffect } from "react";
import styles from "../../styles/assignForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { assignTask } from "../../redux/action";
import { message } from "antd";
import socket from "../../socket/socket";

const AssignForm = () => {
  const User = useSelector((store) => store.user.username);
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

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("✉️ Form submitted with data:", formData);

    if (User === formData.sendTo) {
      messageApi.error("You cannot assign task to yourself");
      return;
    }

    try {
      const result = await dispatch(assignTask(formData));
      console.log("Dispatch result:", result);

      if (result?.error) {
        console.log("❌ Assignment error:", result.error);
        messageApi.error(result.error);
      } else if (result?.task) {
        console.log("✅ Assignment result:", result.message);
        messageApi.success(result.message);

        // ✅ Emit socket event for task assignment
        socket.emit("task-assign", {
          from: User ,
          to: formData.sendTo,
          status: result.status,
          id:result.task._id
        });

      }
    } catch (error) {
      console.log("🔥 Form submission error:", error);
      messageApi.error("Failed to assign task");
    }
  };

  return (
    <>
      {contextHolder}
      <form className={styles.assignForm} onSubmit={handleSubmit}>
        <div className={styles.firstBox}>
          <div className={styles.formGroup1}>
            <label htmlFor="sendTo">Username to Assign</label>
            <input
              type="text"
              id="sendTo"
              name="sendTo"
              placeholder="Enter username (e.g. johndoe)"
              value={formData.sendTo}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup1}>
            <label htmlFor="title">Title</label>
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

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

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












