const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Input validation middleware
const validateSignupInput = (req, res, next) => {
  const { username, email, password } = req.body;

  // Check all required fields exist
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields (username, email, password) are required",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  // Validate password strength
  if (password.length < 4) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 4 characters long",
    });
  }

  next();
};

userRouter.post("/signup", validateSignupInput, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check for existing user with same email
    const existingUser = await userModel.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (existingUser) {
      // Determine which field caused the conflict
      let conflictField;
      let message;

      if (existingUser.email === email && existingUser.username === username) {
        conflictField = "both";
        message = "Both email and username are already in use";
      } else if (existingUser.email === email) {
        conflictField = "email";
        message = "User with this email already exists";
      } else {
        conflictField = "username";
        message = "This username is already taken";
      }
      return res.status(409).json({
        success: false,
        message: message,
        conflict: conflictField,
        available: false,
      });
    }

    // Hash password with salt
    const passwordHash = bcrypt.hashSync(password, +process.env.SALT_ROUND);

    // Create new user with empty collaborators array
    const newUser = new userModel({
      username,
      email,
      password: passwordHash,
      collaborator: [], // Empty array as specified
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Return success response (excluding sensitive data)
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        collaborator: savedUser.collaborator,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle duplicate key error (unique email)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.message,
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});


// Login route
userRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    // Find user
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_SECRET,
      { expiresIn: '1d' }
    );

    
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Refresh token route
userRouter.post('/refresh-token', (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    // Set new cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(403);
  }
});

// Logout route
userRouter.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});


module.exports = userRouter;
