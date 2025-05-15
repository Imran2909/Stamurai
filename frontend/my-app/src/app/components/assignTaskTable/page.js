"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAssignedTasks,
  deleteAssignedTask,
  editAssignedTask,
} from "../../redux/action";
import {
  Modal,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Button,
  message,
} from "antd";
import dayjs from "dayjs";
import styles from "../../styles/assignTable.module.css";

const { Option } = Select;

const AssignTaskTable = ({ showOnly }) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortByDueDate, setSortByDueDate] = useState("asc");

  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    taskId: null,
  });
  const [editModal, setEditModal] = useState({ visible: false, task: null });

  const { assignedTasks: assignData = {}, loading } = useSelector(
    (state) => state.assignTask
  );

  const assignedTasks = assignData.sent || [];
  const receivedTasks = assignData.received || [];

  useEffect(() => {
    dispatch(getAssignedTasks());
  }, [dispatch]);

const filteredTasks = (showOnly === "sent" ? assignedTasks : receivedTasks)
    .filter((task) => task.assignStatus === "assigned")
    .filter(
      (task) =>
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

  const handleDelete = () => {
    dispatch(deleteAssignedTask(deleteModal.taskId)).then(() => {
      message.success("Task deleted");
      setDeleteModal({ visible: false, taskId: null });
    });
  };

  const handleEditSubmit = () => {
    const updated = { ...editModal.task };
    console.log("updated",updated)
    if (!updated.title || !updated.description) {
      return message.error("Title and description are required");
    }

    dispatch(editAssignedTask(updated._id, updated)).then(() => {
      message.success("Task updated");
      setEditModal({ visible: false, task: null });
    });
  };

  const handleEditChange = (field, value) => {
    setEditModal((prev) => ({
      ...prev,
      task: {
        ...prev.task,
        [field]: value,
      },
    }));
  };

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.controls}>
        <div className={styles.search} >
          <Input
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.selects} >
          <Select value={filterStatus} onChange={(val) => setFilterStatus(val)}>
            <Option value="all">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="in progress">In Progress</Option>
            <Option value="completed">Completed</Option>
          </Select>

          <Select
            value={filterPriority}
            onChange={(val) => setFilterPriority(val)}
          >
            <Option value="all">All Priorities</Option>
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>

          <Select
            value={sortByDueDate}
            onChange={(val) => setSortByDueDate(val)} 
          >
            <Option value="asc">Due Date ↑</Option>
            <Option value="desc">Due Date ↓</Option>
          </Select>
        </div>
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
                <td>
                  {showOnly === "sent"
                    ? task.sendTo.username
                    : task.sentBy.username}
                </td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>{task.frequency}</td>
                <td>
                  <Button className={styles.actionBtn}
                    onClick={() =>
                      setEditModal({ visible: true, task: { ...task } })
                    }
                  >
                    ✏️
                  </Button>
                  <Button className={styles.actionBtn}
                    danger
                    onClick={() =>
                      setDeleteModal({ visible: true, taskId: task._id })
                    }
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Delete Modal */}
      <Modal
        title="Confirm Delete"
        open={deleteModal.visible}
        onOk={handleDelete}
        onCancel={() => setDeleteModal({ visible: false, taskId: null })}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this task?</p>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Task"
        open={editModal.visible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModal({ visible: false, task: null })}
        okText="Update"
      >
        {editModal.task && (
          <>
            <Input
              placeholder="Title"
              value={editModal.task.title}
              onChange={(e) => handleEditChange("title", e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <Input.TextArea
              placeholder="Description"
              value={editModal.task.description}
              onChange={(e) => handleEditChange("description", e.target.value)}
              rows={3}
              style={{ marginBottom: 8 }}
            />
            <DatePicker
              value={dayjs(editModal.task.dueDate)}
              onChange={(date) =>
                handleEditChange("dueDate", date.toISOString())
              }
              style={{ width: "100%", marginBottom: 8 }}
            />
            <TimePicker
              value={dayjs(editModal.task.dueDate)}
              onChange={(time) => {
                const currentDate = dayjs(editModal.task.dueDate);
                const updated = currentDate
                  .hour(time.hour())
                  .minute(time.minute());
                handleEditChange("dueDate", updated.toISOString());
              }}
              style={{ width: "100%", marginBottom: 8 }}
            />
            <Select
              value={editModal.task.priority}
              onChange={(val) => handleEditChange("priority", val)}
              style={{ width: "100%", marginBottom: 8 }}
            >
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
            <Select
              value={editModal.task.status}
              onChange={(val) => handleEditChange("status", val)}
              style={{ width: "100%", marginBottom: 8 }}
            >
              <Option value="pending">Pending</Option>
              <Option value="in progress">In Progress</Option>
              <Option value="completed">Completed</Option>
            </Select>
            <Select
              value={editModal.task.frequency}
              onChange={(val) => handleEditChange("frequency", val)}
              style={{ width: "100%" }}
            >
              <Option value="once">Once</Option>
              <Option value="daily">Daily</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
            </Select>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AssignTaskTable;
