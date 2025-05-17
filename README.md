# Stamurai

# Task Management System

A fullstack task management web app built with **Next.js**, **Node.js**, **Express**, and **MongoDB**, featuring real-time task assignment using **Socket.IO** and Redux state management with persistent login.

---

## Setup Instructions

### Backend

1. **Clone the repo:**

   ```bash
   git clone https://github.com/Imran2909/Stamurai.git
   cd stamurai/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file with necessary keys, e.g.:

   ```
   MONGODB_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Start backend server:**

   ```bash
   npm run dev
   ```

### Frontend

1. In a new terminal window/tab:

   ```bash
   cd frontend/my-app
   npm install
   ```

2. **Start frontend development server:**

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Approach

This project is designed as a modern fullstack task management platform supporting:

* **User Authentication:** Signup, login, logout with secure JWT tokens and cookie-based sessions.
* **Task CRUD:** Users can create, read, update, delete tasks.
* **Task Assignment:** Tasks can be assigned to other users with request/accept workflow.
* **Real-time Updates:** Leveraged Socket.IO for instantly notifying assigned tasks and status changes.
* **State Management:** Used Redux Toolkit with redux-persist to maintain app state and session persistence on page reloads.
* **Filtering & Searching:** Task lists support search and filtering by priority, status, and due date.
* **Clean API:** RESTful API built with Express for tasks and user management.

The frontend uses **Next.js** with React and Redux to provide a responsive, dynamic UI.

---

## Assumptions and Trade-offs

* **Localhost API URLs:** The API endpoints are currently hardcoded for `localhost:5000`, assuming local development environment.
* **Simple Authentication Flow:** JWT stored in Redux and persisted locally; for production, consider more secure httpOnly cookie flows.
* **Basic Error Handling:** Errors are managed and shown in the UI, but could be enhanced with more granular UI feedback.
* **Soft Delete for Assigned Tasks:** Assigned tasks are soft deleted to preserve history; deleted tasks no longer appear in the UI.
* **Real-time updates only for assigned tasks:** Socket events focus on assignment-related updates, no real-time for all tasks.
* **No extensive styling:** UI is functional, focusing on usability over design polish.

