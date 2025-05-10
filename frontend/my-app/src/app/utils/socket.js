// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   withCredentials: true,
//   transports: ["websocket"], // fallback if needed
// });

// export default socket;

import { io } from "socket.io-client";
const socket = io("http://localhost:5000", {
  autoConnect: false,
}
);
export default socket;