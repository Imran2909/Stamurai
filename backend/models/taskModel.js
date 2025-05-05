const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  dueTime: { type: String }, // stored as HH:mm format
  priority: {
    type: String,
    enum: ["low", "med", "high"],
    default: "low",
  },
  status: {
    type: String,
    enum: ["pending", "inprogress", "completed"],
    default: "pending",
  },
  frequency: {
    type: String,
    enum: ["once", "daily", "weekly", "monthly"],
    default: "once",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  logs: { type: Array, default: [] },
}, {
  timestamps: true
});

const taskModel = mongoose.model("task", taskSchema);

module.exports = taskModel;
