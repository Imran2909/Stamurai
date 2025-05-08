const express = require("express");
const { connection } = require("./database/db");
const userRouter = require("./routes/userRoute");
const taskRouter = require("./routes/taskRoute")
const cors = require("cors");
const cookieParser = require("cookie-parser"); 
const authMiddleware = require("./middleware/authMiddleware");
const assignTaskRouter = require("./routes/assignTaskRouter");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Home page for Stamurai");
});

app.use("/user", userRouter);

app.use(authMiddleware)

app.use("/task", taskRouter)
app.use("/assignTask", assignTaskRouter )


app.listen(5000, async (req, res) => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log("Cannot connected to DB");
  }
  console.log(`Server is running on port 5000`);
});
