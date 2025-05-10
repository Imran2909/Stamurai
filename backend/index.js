const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { connection } = require("./database/db");
const userRouter = require("./routes/userRoute");
const taskRouter = require("./routes/taskRoute");
const assignTaskRouter = require("./routes/assignTaskRouter");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const server = http.createServer(app);

// Allow CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Home page for Stamurai");
});

app.use("/user", userRouter);

// ⬇️ Protect routes
app.use(authMiddleware);

// Routes
app.use("/task", taskRouter);
app.use("/assignTask", assignTaskRouter);

// 🔌 Setup Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ [SERVER] You have joined");

  socket.broadcast.emit("new_user_joined");

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