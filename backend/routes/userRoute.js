const express = require("express");
const Route = express.Router();

Route.post("/signup", async (req, res) => {
  try {
    const { name,email,password } = req.body
  } catch (error) {
    
  }
});
