"use client";
import React, { useState } from "react";
import styles from "../../styles/assignForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { assignTask } from "../../redux/action";
import { message } from "antd";

const AssignForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    priority: "medium",
    status: "pending",
    frequency: "once",
  });

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      sendTo: formData.username, // backend will resolve username to ObjectId
    };

    const result = await dispatch(assignTask(payload));

    if (result === "success") {
      messageApi.success("Task assigned successfully");
      setFormData({
        username: "",
        title: "",
        description: "",
        dueDate: "",
        dueTime: "",
        priority: "medium",
        status: "pending",
        frequency: "once",
      });
    } else if (result === "Recipient user not found") {
      messageApi.error(" Recipient user not found, please put valid username");
    } else {
      messageApi.error(" Failed to assign task");
    }    
  };

  return (
    <>
      {contextHolder}
      <form className={styles.assignForm} onSubmit={handleSubmit}>
        <div className={styles.firstBox}>
          <div className={styles.formGroup1}>
            <label htmlFor="username">Username to Assign</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username (e.g. johndoe)"
              value={formData.username}
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
