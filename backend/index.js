const express = require("express");
const { connection } = require("./database/db");
const userRouter = require("./routes/userRoute");
const cors = require("cors");
const app = express();
app.use(express.json());
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

app.listen(5000, async (req, res) => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log("Cannot connected to DB");
  }
  console.log(`Server is running on port 5000`);
});
