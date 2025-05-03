
'use client';
import { useState } from 'react';
import styles from '../../styles/table.module.css';
import Form from '../form/page';

const taskData = [
  {
    id: 1,
    title: 'Complete project proposal',
    description: 'Draft and submit the client proposal',
    dueDate: '2023-11-15',
    dueTime: '14:30',
    priority: 'High',
    status: 'Pending',
    frequency: 'Once'
  },
  {
    id: 2,
    title: 'Team meeting',
    description: 'Weekly sprint planning',
    dueDate: '2023-11-10',
    dueTime: '09:00',
    priority: 'Medium',
    status: 'In Progress',
    frequency: 'Weekly'
  },
  {
    id: 3,
    title: 'Code review',
    description: 'Review PRs for feature branch',
    dueDate: '2023-11-08',
    dueTime: '16:45',
    priority: 'Low',
    status: 'Completed',
    frequency: 'Daily'
  }
];

const formatDateTime = (dateStr, timeStr) => {
  const date = new Date(`${dateStr}T${timeStr}`);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(',', '');
};

export default function Table() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h2 className={styles.title}>My Tasks</h2>
        <button 
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          Add Task
        </button>
      </div>

      {/* Table Section */}
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
            {taskData.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                <td className={styles.description}>{task.description}</td>
                <td>{formatDateTime(task.dueDate, task.dueTime)}</td>
                <td>
                  <span className={`${styles.badge} ${styles[task.priority.toLowerCase()]}`}>
                    {task.priority}
                  </span>
                </td>
                <td >
                  <span className={`${styles.badge} ${styles[task.status.replace(' ', '').toLowerCase()]}`}>
                    {task.status}
                  </span>
                </td>
                <td>{task.frequency}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.edit}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button className={styles.delete}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button 
              className={styles.close}
              onClick={() => setIsModalOpen(false)}
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