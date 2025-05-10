// const express = require("express");
// const assignTaskRouter = express.Router();
// const assignTaskModel = require("../models/assignTaskModel");
// const userModel = require("../models/userModel");

// assignTaskRouter.get("/", async (req, res) => {
//   try {
//     const userId = req.userId;
//     const sent = await assignTaskModel
//       .find({ sentBy: userId })
//       .populate("sentBy", "username")
//       .populate("sendTo", "username");

//     const received = await assignTaskModel
//       .find({ sendTo: userId })
//       .populate("sentBy", "username")
//       .populate("sendTo", "username");

//     res.status(200).json({ sent, received });
//   } catch (error) {
//     console.error("Failed to get tasks:", error);
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
//       sendTo, // username
//     } = req.body;

//     const sentBy = req.userId;

//     // 🔍 Find both sender and receiver
//     const senderUser = await userModel.findById(sentBy);
//     const receiverUser = await userModel.findOne({ username: sendTo });

//     if (!receiverUser) {
//       return res.status(404).json({ message: "Recipient user not found" });
//     }

//     // ✅ Check if sender is in receiver's collaborator list
//     const isCollaborator = receiverUser.collaborator.includes(sentBy);

//     // 🆕 Create task with status
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
//           by: sentBy,
//           to: receiverUser._id,
//         },
//       ],
//     });

//     await newTask.save();

//     // 🔔 Send real-time notifications using socket.io
//     if (typeof sendToUser === "function") {
//       // notify receiver
//       sendToUser(
//         receiverUser._id.toString(),
//         isCollaborator ? "taskAssigned" : "taskRequestSent",
//         {
//           task: newTask,
//           from: senderUser.username,
//           message: isCollaborator
//             ? `${senderUser.username} has assigned you a new task.`
//             : `${senderUser.username} has sent you a task request.`,
//         }
//       );

//       // notify sender
//       sendToUser(sentBy.toString(), "taskStatus", {
//         message: isCollaborator
//           ? `Task assigned to ${receiverUser.username}`
//           : `Task request sent to ${receiverUser.username}`,
//         task: newTask,
//       });
//     }

//     return res.status(201).json({
//       message: isCollaborator
//         ? `Task assigned to ${receiverUser.username}`
//         : `Task request sent to ${receiverUser.username}`,
//       task: newTask,
//     });
//   } catch (err) {
//     console.error("Error assigning task:", err);
//     res.status(500).json({ message: "Server error while assigning task" });
//   }
// });

// // Change assignStatus from "requested" to "accepted"
// assignTaskRouter.patch("/approve/:id", async (req, res) => {
//   try {
//     const taskId = req.params.id;

//     const updatedTask = await assignTaskModel.findByIdAndUpdate(
//       taskId,
//       { assignStatus: "accepted" },
//       { new: true }
//     );

//     if (!updatedTask) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     res.status(200).json({
//       message: "Task approved successfully",
//       task: updatedTask,
//     });
//   } catch (error) {
//     console.error("Error approving task:", error);
//     res.status(500).json({ message: "Server error while approving task" });
//   }
// });

// module.exports = assignTaskRouter;

const express = require("express");
const assignTaskRouter = express.Router();
const assignTaskModel = require("../models/assignTaskModel");
const userModel = require("../models/userModel");

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
    console.error("Failed to get tasks:", error);
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
      sendTo, // username
    } = req.body; 

    const sentBy = req.userId;

    const senderUser = await userModel.findById(sentBy);

    const receiverUser = await userModel.findOne({ username: sendTo });
    console.log("🔍 Starting task assignment process");
    console.log("Sender ID:", sentBy);
    console.log("Receiver username:", sendTo);

    if (!receiverUser) {
      return res.status(404).json({ message: "Recipient user not found" });
    }

    console.log("Receiver ID:", receiverUser._id);
    console.log("Sender's collaborators:", senderUser.collaborator);

    if (receiverUser._id.equals(sentBy)) {
      return res
        .status(400)
        .json({ message: "Cannot assign task to yourself" });
    }

    const isCollaborator = senderUser.collaborator.includes(
      receiverUser._id.toString()
    );
    console.log("Is receiver a collaborator?", isCollaborator);

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
          by: sentBy,
          to: receiverUser._id,
        },
      ],
    });

    console.log("Task assignStatus set to:", newTask.assignStatus);
    await newTask.save();

    if (typeof sendToUser === "function") {
      // Notify receiver
      sendToUser(
        receiverUser._id.toString(),
        isCollaborator ? "taskAssigned" : "taskRequest",
        {
          task: newTask,
          from: senderUser.username,
          message: isCollaborator
            ? `${senderUser.username} assigned you a task`
            : `${senderUser.username} wants to assign you a task`,
          requiresAction: !isCollaborator,
        }
      );

      // Notify sender
      sendToUser(sentBy.toString(), "taskStatus", {
        message: isCollaborator
          ? `Task assigned to ${receiverUser.username}`
          : `Task request sent to ${receiverUser.username}`,
        task: newTask,
      });
    }

    res.status(201).json({
      message: isCollaborator
        ? `Task assigned to ${receiverUser.username}`
        : `Task request sent to ${receiverUser.username}`,
      task: newTask,
    });
  } catch (err) {
    console.error("Error assigning task:", err);
    res.status(500).json({ message: "Server error while assigning task" });
  }
});

// New endpoint to handle task request responses
assignTaskRouter.post("/:id/respond", async (req, res) => {
  try {
    const { response } = req.body; // 'accept' or 'reject'
    const userId = req.userId;
    const taskId = req.params.id;

    const task = await assignTaskModel
      .findById(taskId)
      .populate("sentBy", "username")
      .populate("sendTo", "username");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!task.sendTo._id.equals(userId)) {
      return res.status(403).json({ message: "Not authorized to respond" });
    }

    if (task.assignStatus !== "requested") {
      return res
        .status(400)
        .json({ message: "Task is not in requested state" });
    }

    if (response === "accept") {
      // Add to collaborators
      await userModel.findByIdAndUpdate(task.sentBy, {
        $addToSet: { collaborator: userId },
      });

      task.assignStatus = "assigned";
      task.logs.push({
        action: "Task accepted",
        date: new Date(),
        by: userId,
      });
      await task.save();

      // Notify both parties via socket
      if (typeof sendToUser === "function") {
        sendToUser(task.sentBy._id.toString(), "taskRequestResponse", {
          accepted: true,
          message: `${task.sendTo.username} accepted your task request`,
          task,
        });

        sendToUser(userId.toString(), "taskAssigned", {
          message: `You accepted task from ${task.sentBy.username}`,
          task,
        });
      }

      return res.status(200).json({
        message: "Task request accepted",
        task,
      });
    } else {
      // Reject case
      task.assignStatus = "rejected";
      task.logs.push({
        action: "Task rejected",
        date: new Date(),
        by: userId,
      });
      await task.save();

      if (typeof sendToUser === "function") {
        sendToUser(task.sentBy._id.toString(), "taskRequestResponse", {
          accepted: false,
          message: `${task.sendTo.username} rejected your task request`,
          task,
        });
      }

      return res.status(200).json({
        message: "Task request rejected",
        task,
      });
    }
  } catch (error) {
    console.error("Error responding to task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = assignTaskRouter;
