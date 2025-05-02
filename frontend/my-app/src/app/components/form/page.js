'use client';
import styles from '../../styles/form.module.css';

export default function Form() {
  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Create a Task</h2>
      
      <form className={styles.taskForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.inputLabel}>Title</label>
          <input
            type="text"
            id="title"
            className={styles.textInput}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.inputLabel}>Description</label>
          <textarea
            id="description"
            className={styles.textArea}
            placeholder="Enter task description"
            rows={4}
          />
        </div>

        <div className={styles.dateTimeGroup}>
          <div className={styles.formGroup}>
            <label htmlFor="dueDate" className={styles.inputLabel}>Due Date</label>
            <input
              type="date"
              id="dueDate"
              className={styles.dateInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dueTime" className={styles.inputLabel}>Due Time</label>
            <input
              type="time"
              id="dueTime"
              className={styles.timeInput}
            />
          </div>
        </div>

        <div className={styles.selectGroup}>
          <div className={styles.formGroup}>
            <label htmlFor="priority" className={styles.inputLabel}>Priority</label>
            <select id="priority" className={styles.selectInput}>
              <option value="low">Low</option>
              <option value="medium" selected>Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="frequency" className={styles.inputLabel}>Frequency</label>
            <select id="frequency" className={styles.selectInput}>
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          Create Task
        </button>
      </form>
    </div>
  );
}