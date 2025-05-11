// // src/socket.js
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   autoConnect: false,
//   withCredentials: true,
// });

// export default socket;




// socket/socket.js
import { io } from "socket.io-client";

// Create a single socket instance
const socket = io("http://localhost:5000", {
  autoConnect: false, // Don't connect automatically
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 5, // Try to reconnect 5 times
  reconnectionDelay: 1000, // Start with 1s delay
  reconnectionDelayMax: 5000, // Maximum 5s delay
  timeout: 10000, // Connection timeout
});

// Add debugging
socket.onAny((event, ...args) => {
  console.log(`🔄 [Socket Event] ${event}:`, args);
});

export default socket;