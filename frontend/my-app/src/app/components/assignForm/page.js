// "use client";
// import React, { useState, useEffect } from "react";
// import styles from "../../styles/assignForm.module.css";
// import { useDispatch, useSelector } from "react-redux";
// import { assignTask } from "../../redux/action";
// import { message } from "antd";
// import socket from "../../utils/socket.js"; // <-- You’ll need this file

// const AssignForm = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     title: "",
//     description: "",
//     dueDate: "",
//     dueTime: "",
//     priority: "medium",
//     status: "pending",
//     frequency: "once",
//   });

//   const dispatch = useDispatch();
//   const [messageApi, contextHolder] = message.useMessage();
//   const user = useSelector((state) => state.user); // assuming your user info is in Redux

//   useEffect(() => {
//     if (user && user._id) {
//       socket.emit("register", user._id); // register current user with backend
//     }

//     socket.on("taskAssigned", (data) => {
//       if (data.task.sendTo._id === user._id) {
//         messageApi.info(data.message); // user received a new task
//       }
//     });

//     socket.on("taskRequestSent", (data) => {
//       if (data.task.sendTo._id === user._id) {
//         messageApi.info(data.message); // user received a task request
//       }
//     });

//     return () => {
//       socket.off("taskAssigned");
//       socket.off("taskRequestSent");
//     };
//   }, [user, messageApi]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       ...formData,
//       sendTo: formData.username,
//     };

//     const result = await dispatch(assignTask(payload));

//     if (result === "success") {
//       messageApi.success("Task assigned successfully");
//       setFormData({
//         username: "",
//         title: "",
//         description: "",
//         dueDate: "",
//         dueTime: "",
//         priority: "medium",
//         status: "pending",
//         frequency: "once",
//       });
//     } else if (result === "Recipient user not found") {
//       messageApi.error("Recipient user not found, please enter valid username");
//     } else {
//       messageApi.error("Failed to assign task");
//     }
//   };

//   return (
//     <>
//       {contextHolder}
//       <form className={styles.assignForm} onSubmit={handleSubmit}>
//         <div className={styles.firstBox}>
//           <div className={styles.formGroup1}>
//             <label htmlFor="username">Username to Assign</label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               placeholder="Enter username (e.g. johndoe)"
//               value={formData.username}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className={styles.formGroup1}>
//             <label htmlFor="title">Title</label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="description">Description</label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             rows="4"
//             required
//           />
//         </div>

//         <div className={styles.formRow}>
//           <div className={styles.formGroup}>
//             <label htmlFor="dueDate">Due Date</label>
//             <input
//               type="date"
//               id="dueDate"
//               name="dueDate"
//               value={formData.dueDate}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="dueTime">Due Time</label>
//             <input
//               type="time"
//               id="dueTime"
//               name="dueTime"
//               value={formData.dueTime}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className={styles.formRow}>
//           <div className={styles.formGroup}>
//             <label htmlFor="priority">Priority</label>
//             <select
//               id="priority"
//               name="priority"
//               value={formData.priority}
//               onChange={handleChange}
//               required
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="status">Status</label>
//             <select
//               id="status"
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               required
//             >
//               <option value="pending">Pending</option>
//               <option value="inprogress">In Progress</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="frequency">Frequency</label>
//             <select
//               id="frequency"
//               name="frequency"
//               value={formData.frequency}
//               onChange={handleChange}
//             >
//               <option value="once">Once</option>
//               <option value="daily">Daily</option>
//               <option value="weekly">Weekly</option>
//               <option value="monthly">Monthly</option>
//             </select>
//           </div>
//         </div>

//         <button type="submit" className={styles.assignButton}>
//           Assign Task
//         </button>
//       </form>
//     </>
//   );
// };

// export default AssignForm;

// "use client";
// import React, { useState, useEffect } from "react";
// import styles from "../../styles/assignForm.module.css";
// import { useDispatch, useSelector } from "react-redux";
// import { assignTask } from "../../redux/action";
// import { message } from "antd";
// import socket from "../../utils/socket";

// const AssignForm = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     title: "",
//     description: "",
//     dueDate: "",
//     dueTime: "",
//     priority: "medium",
//     status: "pending",
//     frequency: "once",
//   });

//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user); // Assuming user info is stored here
//   const [messageApi, contextHolder] = message.useMessage();

//   useEffect(() => {
//     if (user && user._id) {
//       socket.emit("register", user._id);
//     }

//     socket.on("taskAssigned", (data) => {
//       message.info(data.message);
//     });

//     socket.on("taskRequestSent", (data) => {
//       message.info(data.message);
//     });

//     socket.on("taskStatus", (data) => {
//       message.success(data.message);
//     });

//     return () => {
//       socket.off("taskAssigned");
//       socket.off("taskRequestSent");
//       socket.off("taskStatus");
//     };
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       ...formData,
//       sendTo: formData.username,
//     };

//     const result = await dispatch(assignTask(payload));

//     if (result === "success") {
//       setFormData({
//         username: "",
//         title: "",
//         description: "",
//         dueDate: "",
//         dueTime: "",
//         priority: "medium",
//         status: "pending",
//         frequency: "once",
//       });
//     } else if (result === "Recipient user not found") {
//       messageApi.error("Recipient user not found, please enter a valid username");
//     } else {
//       messageApi.error("Failed to assign task");
//     }
//   };

//   return (
//     <>
//       {contextHolder}
//       <form className={styles.assignForm} onSubmit={handleSubmit}>
//         <div className={styles.firstBox}>
//           <div className={styles.formGroup1}>
//             <label htmlFor="username">Username to Assign</label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               placeholder="Enter username (e.g. johndoe)"
//               value={formData.username}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className={styles.formGroup1}>
//             <label htmlFor="title">Title</label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className={styles.formGroup}>
//           <label htmlFor="description">Description</label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             rows="4"
//             required
//           />
//         </div>

//         <div className={styles.formRow}>
//           <div className={styles.formGroup}>
//             <label htmlFor="dueDate">Due Date</label>
//             <input
//               type="date"
//               id="dueDate"
//               name="dueDate"
//               value={formData.dueDate}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="dueTime">Due Time</label>
//             <input
//               type="time"
//               id="dueTime"
//               name="dueTime"
//               value={formData.dueTime}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className={styles.formRow}>
//           <div className={styles.formGroup}>
//             <label htmlFor="priority">Priority</label>
//             <select
//               id="priority"
//               name="priority"
//               value={formData.priority}
//               onChange={handleChange}
//               required
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="status">Status</label>
//             <select
//               id="status"
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               required
//             >
//               <option value="pending">Pending</option>
//               <option value="inprogress">In Progress</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>

//           <div className={styles.formGroup}>
//             <label htmlFor="frequency">Frequency</label>
//             <select
//               id="frequency"
//               name="frequency"
//               value={formData.frequency}
//               onChange={handleChange}
//             >
//               <option value="once">Once</option>
//               <option value="daily">Daily</option>
//               <option value="weekly">Weekly</option>
//               <option value="monthly">Monthly</option>
//             </select>
//           </div>
//         </div>

//         <button type="submit" className={styles.assignButton}>
//           Assign Task
//         </button>
//       </form>
//     </>
//   );
// };

// export default AssignForm;

"use client";
import React, { useState, useEffect } from "react";
import styles from "../../styles/assignForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { assignTask } from "../../redux/action";
import { message } from "antd";
import socket from "../../utils/socket";

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
  const user = useSelector((state) => state.user);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (user && user._id) {
      socket.emit("register", user._id);
    }

    socket.on("taskAssigned", (data) => {
      messageApi.success(data.message);
    });

    socket.on("taskStatus", (data) => {
      if (data.task.assignStatus === "assigned") {
        messageApi.success(data.message);
      } else if (data.task.assignStatus === "requested") {
        messageApi.info(data.message);
      }
    });

    return () => {
      socket.off("taskAssigned");
      socket.off("taskStatus");
    };
  }, [user, messageApi]);

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

  try {
    const result = await dispatch(assignTask(payload));
    console.log("Dispatch result:", result);
    
    if (result?.error) {
      console.log("❌ Assignment error:", result.error);
      messageApi.error(result.error);
    } else if (result?.task) {
      console.log("✅ Assignment result:", result.message);
      messageApi.success(result.message);
    }
  } catch (error) {
    console.log("🔥 Form submission error:", error);
    messageApi.log("Failed to assign task");
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
