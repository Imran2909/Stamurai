const express = require("express");
const taskRouter = express.Router();
const Task = require("../models/taskModel");
const authMiddleware = require("../middleware/authMiddleware");

// Helper to create a log entry
const createLog = (action, userId) => ({
  action,
  user: userId,
  timestamp: new Date(),
});

// 1. POST: Create a new task
taskRouter.post("/create", authMiddleware,  async (req, res) => {
  try {
      const userId = req.userId; // comes from authMiddleware
      console.log(userId)
    const {
      title,
      description,
      dueDate,
      dueTime,
      priority,
      status,
      frequency,
    } = req.body;

    const newTask = new Task({
      title,
      description,
      dueDate,
      dueTime,
      priority,
      status,
      frequency,
      userId:req.userId,
      logs: [createLog("created", userId)],
    });

    await newTask.save();
    console.log({ message: "Task created successfully", task: newTask })
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error: error.message });
  }
});

// 2. GET: Fetch all tasks of the authenticated user
taskRouter.get("/all", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({ userId });
    // console.log(userId,tasks)
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
});

// 2. GET: Fetch all tasks of the authenticated user
taskRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({
      $or: [
        { logs: { $not: { $elemMatch: { action: 'deleted' } } } },
        { logs: { $exists: false } }
      ],
      userId: req.userId
    });
    // console.log(userId,tasks)
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
});

// 3. PATCH: Update a task by ID
taskRouter.patch("/update/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;
    const updateData = req.body;
    updateData.$push = {
      logs: createLog("updated", userId),
    };
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
});

// 4. DELETE: Soft delete a task by pushing a 'deleted' log
taskRouter.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;
    const deletedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        $push: {
          logs: createLog("deleted", userId),
        },
        status: "completed", // optional: you can also mark status as completed or soft-deleted
      },
      { new: true }
    );

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task soft-deleted", task: deletedTask });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
});

module.exports = taskRouter;
