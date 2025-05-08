const mongoose = require("mongoose");

const assignTaskSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  dueTime: { type: String }, // stored as HH:mm format
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
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
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  }, 
  sendTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  assignStatus: {
    type: String,
    enum: ["requested", "accepted", "rejected"],
    default: "once",
  },
  logs: { type: Array, default: [] },
}, {
  timestamps: true
});

const assignTaskModel = mongoose.model("assignTask", assignTaskSchema);

module.exports = assignTaskModel;
