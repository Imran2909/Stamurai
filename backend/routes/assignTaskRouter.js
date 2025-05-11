// const express = require("express");
// const assignTaskModel = require("../models/assignTaskModel");
// const userModel = require("../models/userModel");

// module.exports = function(io) {
//   const assignTaskRouter = express.Router();

//   assignTaskRouter.get("/", async (req, res) => {
//     try {
//       const userId = req.userId;
//       const sent = await assignTaskModel
//         .find({ sentBy: userId })
//         .populate("sentBy", "username")
//         .populate("sendTo", "username");

//       const received = await assignTaskModel
//         .find({ sendTo: userId, assignStatus: { $ne: "rejected" } })
//         .populate("sentBy", "username")
//         .populate("sendTo", "username");

//       res.status(200).json({ sent, received });
//     } catch (error) {
//       console.error("Failed to get tasks:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   });

//   assignTaskRouter.post("/", async (req, res) => {
//     try {
//       const {
//         title,
//         description,
//         dueDate,
//         dueTime,
//         priority,
//         status,
//         frequency,
//         sendTo, // username
//       } = req.body;

//       const sentBy = req.userId;

//       const senderUser = await userModel.findById(sentBy);
//       const receiverUser = await userModel.findOne({ username: sendTo });

//       if (!receiverUser) {
//         return res.status(404).json({ message: "Recipient user not found" });
//       }

//       if (receiverUser._id.equals(sentBy)) {
//         return res.status(400).json({ message: "Cannot assign task to yourself" });
//       }

//       const isCollaborator = receiverUser.collaborator.includes(senderUser.username.toString());
//       console.log("Is receiver a collaborator?", isCollaborator);

//       const newTask = new assignTaskModel({
//         title,
//         description,
//         dueDate,
//         dueTime,
//         priority,
//         status,
//         frequency,
//         sentBy,
//         sendTo: receiverUser._id,
//         assignStatus: isCollaborator ? "assigned" : "requested",
//         logs: [
//           {
//             action: isCollaborator ? "Task assigned" : "Task request sent",
//             date: new Date(),
//             by: senderUser._id,
//             to: receiverUser._id,
//           },
//         ],
//       });

//       await newTask.save();

//       io.to(receiverUser.username).emit("task_status", {
//         message: isCollaborator
//           ? `New task assigned by ${senderUser.username}`
//           : `New task request from ${senderUser.username}`,
//         status: isCollaborator ? "assigned" : "requested",
//       });

//       res.status(201).json({
//         message: isCollaborator
//           ? `Task assigned to ${receiverUser.username}`
//           : `Task request sent to ${receiverUser.username}`,
//         task: newTask,
//       });
//     } catch (err) {
//       console.error("Error assigning task:", err);
//       res.status(500).json({ message: "Server error while assigning task" });
//     }
//   });

//   assignTaskRouter.post("/:id/respond", async (req, res) => {
//     try {
//       const { response } = req.body; // 'accept' or 'reject'
//       const userId = req.userId;
//       const taskId = req.params.id;

//       const task = await assignTaskModel
//         .findById(taskId)
//         .populate("sentBy", "username")
//         .populate("sendTo", "username");

//       if (!task) {
//         return res.status(404).json({ message: "Task not found" });
//       }

//       if (!task.sendTo._id.equals(userId)) {
//         return res.status(403).json({ message: "Not authorized to respond" });
//       }

//       if (task.assignStatus !== "requested") {
//         return res.status(400).json({ message: "Task is not in requested state" });
//       }

//       if (response === "accept") {
//         await userModel.findByIdAndUpdate(task.sentBy._id, {
//           $addToSet: { collaborator: userId },
//         });

//         task.assignStatus = "assigned";
//         task.logs.push({
//           action: "Task accepted",
//           date: new Date(),
//           by: userId,
//         });
//         await task.save();

//         io.to(task.sentBy.username).emit("taskRequestResponse", {
//           accepted: true,
//           message: `${task.sendTo.username} accepted your task request`,
//           task,
//         });

//         io.to(task.sendTo.username).emit("taskAssigned", {
//           message: `You accepted task from ${task.sentBy.username}`,
//           task,
//         });

//         return res.status(200).json({ message: "Task request accepted", task });
//       } else {
//         task.assignStatus = "rejected";
//         task.logs.push({
//           action: "Task rejected",
//           date: new Date(),
//           by: userId,
//         });
//         await task.save();

//         io.to(task.sentBy.username).emit("taskRequestResponse", {
//           accepted: false,
//           message: `${task.sendTo.username} rejected your task request`,
//           task,
//         });

//         return res.status(200).json({ message: "Task request rejected", task });
//       }
//     } catch (error) {
//       console.error("Error responding to task:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   });

//   return assignTaskRouter;
// };




























// const express = require("express");
// const assignTaskRouter = express.Router();
// const assignTaskModel = require("../models/assignTaskModel");
// const userModel = require("../models/userModel");
// const { io } = require("../index");

// assignTaskRouter.get("/", async (req, res) => {
//   try {
//     const userId = req.userId;
//     const sent = await assignTaskModel
//       .find({ sentBy: userId })
//       .populate("sentBy", "username")
//       .populate("sendTo", "username");

//     const received = await assignTaskModel
//       .find({ sendTo: userId, assignStatus: { $ne: "rejected" } })
//       .populate("sentBy", "username")
//       .populate("sendTo", "username");

//     res.status(200).json({ sent, received });
//   } catch (error) {
//     console.log("Failed to get tasks:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// assignTaskRouter.post("/", async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       dueDate,
//       dueTime,
//       priority,
//       status,
//       frequency,
//       sendTo,
//     } = req.body;

//     const sentBy = req.userId;

//     const senderUser = await userModel.findById(sentBy);
//     const receiverUser = await userModel.findOne({ username: sendTo });

//     if (!receiverUser) {
//       return res.status(404).json({ message: "Recipient user not found" });
//     }

//     if (receiverUser._id.equals(sentBy)) {
//       return res
//         .status(400)
//         .json({ message: "Cannot assign task to yourself" });
//     }

//     const isCollaborator = receiverUser.collaborator.includes(
//       senderUser.username
//     );

//     const newTask = new assignTaskModel({
//       title,
//       description,
//       dueDate,
//       dueTime,
//       priority,
//       status,
//       frequency,
//       sentBy,
//       sendTo: receiverUser._id,
//       assignStatus: isCollaborator ? "assigned" : "requested",
//       logs: [
//         {
//           action: isCollaborator ? "Task assigned" : "Task request sent",
//           date: new Date(),
//           by: senderUser._id,
//           to: receiverUser._id,
//         },
//       ],
//     });

//     await newTask.save();

//     // ✅ Emit using username
//     io.to(receiverUser.username).emit("task_status", {
//       message: isCollaborator
//         ? `New task assigned by ${senderUser.username}`
//         : `New task request from ${senderUser.username}`,
//       status: newTask.assignStatus,
//       task: newTask,
//     });

//     res.status(201).json({
//       message: `Task ${newTask.assignStatus} to ${receiverUser.username}`,
//       task: newTask,
//     });
//   } catch (err) {
//     console.error("Error assigning task:", err);
//     res.status(500).json({ message: "Server error while assigning task" });
//   }
// });

// assignTaskRouter.post("/:id/respond", async (req, res) => {
//   try {
//     const { response } = req.body;
//     const userId = req.userId;
//     const taskId = req.params.id;

//     const task = await assignTaskModel
//       .findById(taskId)
//       .populate("sentBy", "username")
//       .populate("sendTo", "username");

//     if (!task) return res.status(404).json({ message: "Task not found" });

//     if (!task.sendTo._id.equals(userId))
//       return res.status(403).json({ message: "Not authorized to respond" });

//     if (task.assignStatus !== "requested")
//       return res.status(400).json({ message: "Task is not in requested state" });

//     if (response === "accept") {
//       await userModel.findByIdAndUpdate(task.sentBy._id, {
//         $addToSet: { collaborator: task.sendTo.username },
//       });

//       task.assignStatus = "assigned";
//       task.logs.push({ action: "Task accepted", date: new Date(), by: userId });
//       await task.save();

//       io.to(task.sentBy.username).emit("taskRequestResponse", {
//         accepted: true,
//         message: `${task.sendTo.username} accepted your task request`,
//         task,
//       });

//       io.to(task.sendTo.username).emit("taskAssigned", {
//         message: `You accepted task from ${task.sentBy.username}`,
//         task,
//       });

//       return res.status(200).json({ message: "Task request accepted", task });
//     } else {
//       task.assignStatus = "rejected";
//       task.logs.push({ action: "Task rejected", date: new Date(), by: userId });
//       await task.save();

//       io.to(task.sentBy.username).emit("taskRequestResponse", {
//         accepted: false,
//         message: `${task.sendTo.username} rejected your task request`,
//         task,
//       });

//       return res.status(200).json({ message: "Task request rejected", task });
//     }
//   } catch (error) {
//     console.log("Error responding to task:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = assignTaskRouter;

























const express = require("express");
const assignTaskModel = require("../models/assignTaskModel");
const userModel = require("../models/userModel");

module.exports = function (io) {
  const assignTaskRouter = express.Router();

  assignTaskRouter.get("/", async (req, res) => {
    try {
      const userId = req.userId;
      const sent = await assignTaskModel
        .find({ sentBy: userId })
        .populate("sentBy", "username")
        .populate("sendTo", "username");

      const received = await assignTaskModel
        .find({ sendTo: userId, assignStatus: { $ne: "rejected" } })
        .populate("sentBy", "username")
        .populate("sendTo", "username");

      res.status(200).json({ sent, received });
    } catch (error) {
      console.log("Failed to get tasks:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  assignTaskRouter.post("/", async (req, res) => {
    try {
      const {
        title,
        description,
        dueDate,
        dueTime,
        priority,
        status,
        frequency,
        sendTo,
      } = req.body;

      const sentBy = req.userId;

      const senderUser = await userModel.findById(sentBy);
      const receiverUser = await userModel.findOne({ username: sendTo });

      if (!receiverUser) {
        return res.status(404).json({ message: "Recipient user not found" });
      }

      if (receiverUser._id.equals(sentBy)) {
        return res
          .status(400)
          .json({ message: "Cannot assign task to yourself" });
      }

      const isCollaborator = receiverUser.collaborator.includes(
        senderUser.username
      );

      const newTask = new assignTaskModel({
        title,
        description,
        dueDate,
        dueTime,
        priority,
        status,
        frequency,
        sentBy,
        sendTo: receiverUser._id,
        assignStatus: isCollaborator ? "assigned" : "requested",
        logs: [
          {
            action: isCollaborator ? "Task assigned" : "Task request sent",
            date: new Date(),
            by: senderUser._id,
            to: receiverUser._id,
          },
        ],
      });

      await newTask.save();

    

      res.status(201).json({
        message: `Task ${newTask.assignStatus} to ${receiverUser.username}`,
        task: newTask,
      });
    } catch (err) {
      console.error("Error assigning task:", err);
      res.status(500).json({ message: "Server error while assigning task" });
    }
  });

  assignTaskRouter.post("/:id/respond", async (req, res) => {
    try {
      const { response } = req.body;
      const userId = req.userId;
      const taskId = req.params.id;

      const task = await assignTaskModel
        .findById(taskId)
        .populate("sentBy", "username")
        .populate("sendTo", "username");

      if (!task) return res.status(404).json({ message: "Task not found" });

      if (!task.sendTo._id.equals(userId))
        return res.status(403).json({ message: "Not authorized to respond" });

      if (task.assignStatus !== "requested")
        return res
          .status(400)
          .json({ message: "Task is not in requested state" });

      if (response === "accept") {
        await userModel.findByIdAndUpdate(task.sentBy._id, {
          $addToSet: { collaborator: task.sendTo.username },
        });

        task.assignStatus = "assigned";
        task.logs.push({ action: "Task accepted", date: new Date(), by: userId });
        await task.save();

        io.to(task.sentBy.username).emit("taskRequestResponse", {
          accepted: true,
          message: `${task.sendTo.username} accepted your task request`,
          task,
        });

        io.to(task.sendTo.username).emit("taskAssigned", {
          message: `You accepted task from ${task.sentBy.username}`,
          task,
        });

        return res.status(200).json({ message: "Task request accepted", task });
      } else {
        task.assignStatus = "rejected";
        task.logs.push({ action: "Task rejected", date: new Date(), by: userId });
        await task.save();

        io.to(task.sentBy.username).emit("taskRequestResponse", {
          accepted: false,
          message: `${task.sendTo.username} rejected your task request`,
          task,
        });

        return res.status(200).json({ message: "Task request rejected", task });
      }
    } catch (error) {
      console.log("Error responding to task:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  return assignTaskRouter;
};
