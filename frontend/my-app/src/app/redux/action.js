import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  FETCH_TASKS_REQUEST,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAILURE,
  LOGOUT,
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_FAILURE,
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAILURE,
  SET_SEARCH_QUERY,
  GET_ASSIGNED_TASKS_REQUEST,
  GET_ASSIGNED_TASKS_SUCCESS,
  GET_ASSIGNED_TASKS_FAILURE,
  NEW_ASSIGN_TASK_RECEIVED,
  UPDATE_TASK_STATUS,
  RESPOND_TO_TASK_REQUEST,
  INCREMENT_REQUEST_COUNT,
  DECREMENT_REQUEST_COUNT,
  TASK_ASSIGNED,
  DELETE_ASSIGNED_TASK_REQUEST,
  DELETE_ASSIGNED_TASK_SUCCESS,
  DELETE_ASSIGNED_TASK_FAILURE,
  EDIT_ASSIGNED_TASK_REQUEST,
  EDIT_ASSIGNED_TASK_SUCCESS,
  EDIT_ASSIGNED_TASK_FAILURE,
} from "./actionTypes";
import axios from "axios";

// for signing up
export const signupUser = (username, email, password) => async (dispatch) => {
  dispatch({ type: SIGNUP_REQUEST });

  try {
    const response = await fetch("http://localhost:5000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    dispatch({ type: SIGNUP_SUCCESS });
    return { success: true, message: "Account created successfully!" };
  } catch (error) {
    dispatch({ type: SIGNUP_FAILURE, payload: error.message });
    return { success: false, message: error.message };
  }
};

//Login user
export const loginUser = (username, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const response = await fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    dispatch({
      type: LOGIN_SUCCESS,
      payload: [data.accessToken, data.user.username],
    });
    return { success: true, message: "Login Successful" };
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
    return { success: false, message: error.message };
  }
};

// Logout user
export const logoutUser = () => async (dispatch) => {
  try {
    // 1. Clear server-side session
    await axios.post(
      "http://localhost:5000/user/logout",
      {},
      {
        withCredentials: true,
      }
    );
    // 2. Clear Redux state
    dispatch({ type: LOGOUT });
    return true;
  } catch (error) {
    console.log("Logout failed:", error);
    return false;
  }
};

// fetch all tasks on mounting
export const fetchTasks = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_TASKS_REQUEST });

    try {
      const response = await axios.get("http://localhost:5000/task/", {
        withCredentials: true,
      });

      dispatch({ type: FETCH_TASKS_SUCCESS, payload: response.data });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        dispatch({ type: FETCH_TASKS_FAILURE, payload: "Unauthorized" });
      } else {
        dispatch({ type: FETCH_TASKS_FAILURE, payload: error.message });
      }
    }
  };
};

// Creating a new task
export const createTask = (taskData) => async (dispatch) => {
  dispatch({ type: CREATE_TASK_REQUEST });

  try {
    const response = await axios.post(
      "http://localhost:5000/task/create",
      taskData,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: CREATE_TASK_SUCCESS,
      payload: response.data.task,
    });

    // Return success flag and data
    return {
      payload: response.data,
      success: true,
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;

    dispatch({
      type: CREATE_TASK_FAILURE,
      payload: errorMessage,
    });

    // Return error information
    return {
      success: false,
      message: errorMessage,
    };
  }
};


// to soft delete the task
export const deleteTask = (id, token) => async (dispatch) => {
  dispatch({ type: DELETE_TASK_REQUEST });

  try {
    const res = await axios.delete(`http://localhost:5000/task/delete/${id}`, {
      withCredentials: true,
    });

    dispatch({ type: DELETE_TASK_SUCCESS, payload: id });
    return "deleted";
  } catch (error) {
    dispatch({
      type: DELETE_TASK_FAILURE,
      payload: error.response?.data?.message || "Failed to delete task",
    });
    return "failed";
  }
};

// for handeling a task update
export const updateTask = (id, updatedData) => async (dispatch) => {
  dispatch({ type: FETCH_TASKS_REQUEST }); // optional: reuse for loader

  try {
    const res = await axios.patch(
      `http://localhost:5000/task/update/${id}`,
      updatedData,
      {
        withCredentials: true,
      }
    );

    dispatch(fetchTasks()); // Refresh task list
    return { payload: res.data.task };
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_FAILURE,
      payload: error.response?.data?.message || "Failed to update task",
    });
    return { error };
  }
};

// for searching functionality
export const setSearchQuery = (query) => ({
  type: SET_SEARCH_QUERY,
  payload: query,
});

// to assign task
export const assignTask = (taskData) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:5000/assignTask", taskData,{
      withCredentials:true
    });

    if (response.data.task.assignStatus === "requested") {
      console.log("This was a REQUEST (not direct assignment)");
    }
    dispatch({type:TASK_ASSIGNED,payload:response.data.task._id})
    return response.data;
  } catch (error) {
    console.log("Full error details:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });
    throw error;
  }
};

// Fetch assigned tasks
export const getAssignedTasks = () => async (dispatch) => {
  dispatch({ type: GET_ASSIGNED_TASKS_REQUEST });
  try {
    const response = await axios.get("http://localhost:5000/assignTask/", {
      withCredentials: true,
    });
    dispatch({
      type: GET_ASSIGNED_TASKS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_ASSIGNED_TASKS_FAILURE,
      payload: error.message,
    });
  }
};

// Handle new task received via socket
export const newAssignedTaskReceived = (task) => (dispatch) => {
  dispatch({
    type: NEW_ASSIGN_TASK_RECEIVED,
    payload: task,
  });

  if (task.assignStatus === "requested") {
    dispatch({ type: INCREMENT_REQUEST_COUNT });
  }
};

// Update task status (used for socket updates)
export const updateTaskStatus = (task) => ({
  type: UPDATE_TASK_STATUS,
  payload: task,
});

// Respond to task request (accept/reject)
export const respondToTaskRequest = (taskId, response) => async (dispatch) => {
  dispatch({ type: RESPOND_TO_TASK_REQUEST });
  try {
    const res = await axios.post(
      `http://localhost:5000/assignTask/${taskId}/respond`,
      { response },
      { withCredentials: true }
    );
    dispatch({ type: DECREMENT_REQUEST_COUNT });
    return res.data;
  } catch (error) {
    return { error: error.response?.data?.message || "Failed to respond" };
  }
};

// PUT: Edit an assigned task
export const editAssignedTask = (taskId, updates) => async (dispatch) => {
  dispatch({ type: EDIT_ASSIGNED_TASK_REQUEST });
  try {
    const response = await axios.put(
      `http://localhost:5000/assignTask/edit/${taskId}`,
      updates,
      { withCredentials: true }
    );
    dispatch({
      type: EDIT_ASSIGNED_TASK_SUCCESS,
      payload: response.data.task,
    });
  } catch (error) {
    dispatch({
      type: EDIT_ASSIGNED_TASK_FAILURE,
      payload: error.message,
    });
  }
};

// DELETE: Soft-delete an assigned task
export const deleteAssignedTask = (taskId) => async (dispatch) => {
  dispatch({ type: DELETE_ASSIGNED_TASK_REQUEST });
  try {
    const response = await axios.delete(
      `http://localhost:5000/assignTask/delete/${taskId}`,
      { withCredentials: true }
    );
    dispatch({
      type: DELETE_ASSIGNED_TASK_SUCCESS,
      payload: response.data.task,
    });
  } catch (error) {
    dispatch({
      type: DELETE_ASSIGNED_TASK_FAILURE,
      payload: error.message,
    });
  }
};

