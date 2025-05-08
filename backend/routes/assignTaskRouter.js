const express = require("express");
const assignTaskRouter = express.Router();
const assignTaskModel = require("../models/assignTaskModel");
const userModel = require("../models/userModel"); // assuming this is your user model

assignTaskRouter.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const tasks = await assignTaskModel
      .find({ sentBy : userId })
      .populate("sentBy", "username email") // include sender info
      .populate("sendTo", "username email"); // include receiver info
    res.status(200).json(tasks);
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
        sendTo, // this is a username now
      } = req.body;
  
      const sentBy = req.userId; // coming from auth middleware
  
      // Find user by username
      const userTo = await userModel.findOne({ username: sendTo });
      if (!userTo) {
        console.log("Recipient user not found")
       return res.status(404).json({ message: "Recipient user not found" });
       
      }
  
      const newTask = new assignTaskModel({
        title,
        description,
        dueDate,
        dueTime,
        priority,
        status,
        frequency,
        sentBy,
        sendTo: userTo._id, // use the resolved ObjectId
        assignStatus: "requested",
        logs: [
          {
            action: "Task assigned",
            date: new Date(),
            by: sentBy,
            to: userTo._id,
          },
        ],
      });
  
      await newTask.save();
  
      res.status(201).json({
        message: "Task assigned successfully",
        task: newTask,
      });
    } catch (err) {
      console.error("Error assigning task:", err);
      res.status(500).json({ message: "Server error while assigning task" });
    }
  });

module.exports = assignTaskRouter;
