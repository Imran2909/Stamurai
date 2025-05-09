const connectedUsers = new Map(); // key: userId, value: socket.id

function setupSocketServer(io) {
  io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    // Handle user login
    socket.on("register", (userId) => {
      if (userId) {
        connectedUsers.set(userId, socket.id);
        console.log(`✅ Registered socket for user ${userId}`);
      }
    });

    // Handle task request responses (accept/reject)
    socket.on("respondToTaskRequest", async ({ taskId, response, userId }) => {
      console.log("🔄 Task request response received:", {
        taskId,
        response,
        userId,
      });
      try {
        const task = await assignTaskModel
          .findById(taskId)
          .populate("sentBy", "username")
          .populate("sendTo", "username");

        if (!task) {
          return socket.emit("error", { message: "Task not found" });
        }

        if (response === "accepted") {
          // Add to collaborators
          await userModel.findByIdAndUpdate(task.sentBy, {
            $addToSet: { collaborator: userId },
          });

          // Update task status
          task.assignStatus = "assigned";
          task.logs.push({
            action: "Task accepted",
            date: new Date(),
            by: userId,
          });
          await task.save();

          // When sending task notifications
          sendToUser(
            receiverUser._id.toString(),
            isCollaborator ? "taskAssigned" : "taskRequest",
            {
              task: newTask,
              from: senderUser.username,
              message: isCollaborator
                ? `${senderUser.username} assigned you a task`
                : `${senderUser.username} wants to assign you a task`,
              requiresAction: !isCollaborator, // Crucial for modal trigger
            }
          );

          sendToUser(userId.toString(), "taskAssigned", {
            message: `You accepted task from ${task.sentBy.username}`,
            task,
          });
        } else {
          // Rejected case
          task.assignStatus = "rejected";
          task.logs.push({
            action: "Task rejected",
            date: new Date(),
            by: userId,
          });
          await task.save();

          sendToUser(task.sentBy._id.toString(), "taskRequestResponse", {
            accepted: false,
            message: `${task.sendTo.username} rejected your task request`,
            task,
          });
        }
      } catch (error) {
        console.error("Error handling task response:", error);
        socket.emit("error", { message: "Error processing request" });
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, sockId] of connectedUsers.entries()) {
        if (sockId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`❌ User ${userId} disconnected`);
          break;
        }
      }
    });
  });

 global.sendToUser = (userId, event, payload) => {
  console.log(`Attempting to send ${event} to user ${userId}`);
  console.log("Payload being sent:", payload);
  
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, payload);
    console.log(`Event ${event} sent successfully to socket ${socketId}`);
  } else {
    console.warn(`User ${userId} not connected - event not sent`);
  }
};
}

module.exports = { setupSocketServer };
