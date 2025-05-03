const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, require: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  collaborator: { type: Array, required: true },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel
