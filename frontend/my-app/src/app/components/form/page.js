'use client';
import { useState } from 'react';
import styles from '../../styles/form.module.css';
import { useDispatch } from 'react-redux';
import { createTask } from '../../redux/action';
import { message } from 'antd';

export default function Form({ onSuccess, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    frequency: 'once',
    status: 'pending',
  });
  const [messageApi, contextHolder] = message.useMessage();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Dispatch the createTask action
      const result = await dispatch(createTask(formData));
      
      if (result?.payload) { // Check if we got a successful response
        messageApi.open({
          type: 'success',
          content: 'Task created successfully',
        });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          dueTime: '',
          priority: 'medium',
          frequency: 'once',
          status: 'pending',
        });

        // Notify parent if needed
        onSuccess?.();
        onClose?.(); // Close modal if this is in a modal
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: error.message || 'Failed to create task',
      });
      console.error('Task creation error:', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      {contextHolder}
      <h2 className={styles.formTitle}>Create a New Task</h2>
      
      <form onSubmit={handleSubmit} className={styles.taskForm}>
        {/* Title Input */}
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

        {/* Description Input */}
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

        {/* Date/Time Group */}
        <div className={styles.dateTimeGroup}>
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

        {/* Select Group */}
        <div className={styles.selectGroup}>
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

          <div className={styles.formGroup}>
            <label htmlFor="frequency" className={styles.inputLabel}>Frequency</label>
            <select 
              id="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className={styles.selectInput}>
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <button type="submit"className={styles.submitButton}>Create Task</button>
      </form>
    </div>
  );
}