"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAssignedTasks } from "../../redux/action";
import styles from "../../styles/assignTable.module.css";

const AssignTaskTable = ({ showOnly, title }) => {
  const dispatch = useDispatch();
  const { assignedTasks, loading } = useSelector((state) => state.assignTask);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortByDueDate, setSortByDueDate] = useState("asc");
  console.log(assignedTasks)

  useEffect(() => {
    dispatch(getAssignedTasks());
  }, [dispatch]);

  const filteredTasks = assignedTasks
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter((task) =>
      filterStatus === "all" ? true : task.status === filterStatus
    )
    .filter((task) =>
      filterPriority === "all" ? true : task.priority === filterPriority
    )
    .sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return sortByDueDate === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className={styles.tableWrapper}>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select value={sortByDueDate} onChange={(e) => setSortByDueDate(e.target.value)}>
          <option value="asc">Due Date ↑</option>
          <option value="desc">Due Date ↓</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.taskTable}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>{showOnly === "sent" ? "To" : "From"}</th>
              <th>Due On</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Frequency</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{showOnly === "sent" ? task.sendTo.username : task.sentBy.username}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>{task.frequency}</td>
                <td>
                  {/* Placeholder for future edit/delete buttons */}
                  <button className={styles.actionBtn}>Edit</button>
                  <button className={styles.actionBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignTaskTable;
