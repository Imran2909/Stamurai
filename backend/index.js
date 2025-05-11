const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { connection } = require("./database/db");
const userRouter = require("./routes/userRoute");
const taskRouter = require("./routes/taskRoute");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const server = http.createServer(app);

// Allow CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Home page for Stamurai");
});

app.use("/user", userRouter);

// 🔌 Setup Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// Pass io into router
const assignTaskRouter = require("./routes/assignTaskRouter")(io);

// ⬇️ Protect routes
app.use(authMiddleware);

// Routes
app.use("/task", taskRouter);
app.use("/assignTask", assignTaskRouter);

const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("✅ [SERVER] A user connected");

  socket.on("join", (username) => {
    socket.join(username);
    console.log(`👥 [SERVER] ${username} joined their personal room`);

    // ✅ Notify all users including the one who joined
    io.emit("new_user_joined", { username });
  });

  socket.on("task-assign", ({ from, to, status }) => {
    console.log(`📤 [SERVER] Sending task to ${to}`);
    io.to(to).emit("task-assign", { from, status });
  });

  socket.on("disconnect", () => {
    console.log("❌ [SERVER] User disconnected");
  });
});

server.listen(5000, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log("Cannot connect to DB");
  }
  console.log(`Server is running on port 5000`);
});
