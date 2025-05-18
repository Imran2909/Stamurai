// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://stamurai-backend-cm0v.onrender.com", {
  transports: ['websocket'],
  withCredentials: true
});


export default socket;
