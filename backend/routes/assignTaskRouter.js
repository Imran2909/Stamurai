const express = require("express");
const assignTaskModel = require("../models/assignTaskModel");
const userModel = require("../models/userModel");

module.exports = function (io) {
  const assignTaskRouter = express.Router();

  // Socket.IO logic
  io.on("connection", (socket) => {
    socket.on("join", (username) => {
      socket.join(username);
      console.log(`👥 User ${username} joined their room`);
      // socket.broadcast.emit("new_user_joined", { username });
    });

    socket.on("accept-task", async (info) => {
      try {
        const { id: taskId, from, to, status } = info;
        const task = await assignTaskModel
          .findById(taskId)
          .populate("sentBy", "username")
          .populate("sendTo", "username");

        if (!task) {
          return socket.emit("error", { message: "Task not found" });
        }

        if (task.assignStatus !== "requested") {
          return socket.emit("error", {
            message: "Task is not in requested state",
          });
        }

        // Update 'from' user's collaborator list to include 'to'
        const sender = await userModel.findOne({ username: from });
        const receiver = await userModel.findOne({ username: to });

        if (!sender || !receiver) {
          return socket.emit("error", {
            message: "Sender or receiver not found",
          });
        }

        // Add receiver's username to sender's collaborators
        if (!sender.collaborator.includes(receiver.username)) {
          sender.collaborator.push(receiver.username);
          await sender.save();
        }

        // Update task status
        task.assignStatus = "assigned";
        task.logs.push({
          action: "Task accepted",
          date: new Date(),
          by: receiver._id,
        });
        await task.save();

        // Notify both users
        io.to(from).emit("taskRequestSuccess", {
          accepted: true,
          message: `${to} accepted your task request`,
          task,
        });

        console.log(`✅ Task ${taskId} accepted by ${to}`);
      } catch (err) {
        console.error("Socket accept-task error:", err);
        socket.emit("error", { message: "Internal server error" });
      }
    });

    socket.on("reject-task", async (info) => {
      try {
        const { id: taskId, from, to, status } = info;
        const task = await assignTaskModel
          .findById(taskId)
          .populate("sentBy", "username")
          .populate("sendTo", "username");

        if (!task) {
          return socket.emit("error", { message: "Task not found" });
        }

        if (task.assignStatus !== "requested") {
          return socket.emit("error", {
            message: "Task is not in requested state",
          });
        }

        // Update 'from' user's collaborator list to include 'to'
        const sender = await userModel.findOne({ username: from });
        const receiver = await userModel.findOne({ username: to });

        if (!sender || !receiver) {
          return socket.emit("error", {
            message: "Sender or receiver not found",
          });
        }

        // Update task status
        task.assignStatus = "rejected";
        task.logs.push({
          action: "Task Rejected",
          date: new Date(),
          by: receiver._id,
        });
        await task.save();

        // Notify both users
        console.log("rejected task");
        io.to(from).emit("taskRequestReject", {
          accepted: false,
          message: `${to} rejected your task request`,
          task,
        });

        console.log(`✅ Task ${taskId} rejected by ${to}`);
      } catch (err) {
        console.error("Socket accept-task error:", err);
        socket.emit("error", { message: "Internal server error" });
      }
    });

    socket.on("disconnect", () => {
      console.log("🧩 [Router] Socket disconnected");
    });
  });

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
        status: newTask.assignStatus,
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
        task.logs.push({
          action: "Task accepted",
          date: new Date(),
          by: userId,
        });
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
        task.logs.push({
          action: "Task rejected",
          date: new Date(),
          by: userId,
        });
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
