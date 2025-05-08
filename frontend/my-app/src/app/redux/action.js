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
  ASSIGN_TASK_REQUEST,
  ASSIGN_TASK_SUCCESS,
  ASSIGN_TASK_FAILURE,
  GET_ASSIGNED_TASKS_REQUEST,
  GET_ASSIGNED_TASKS_SUCCESS,
  GET_ASSIGNED_TASKS_FAILURE,
} from "./actionTypes";
import axios from 'axios'

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
    console.log("data from acct", data.accessToken);
    dispatch({ type: LOGIN_SUCCESS, payload: data.accessToken });
    return { success: true, message:"Login Successful" };
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
    return { success: false, message: error.message };
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    // 1. Clear server-side session
    await axios.post('http://localhost:5000/user/logout', {}, { 
      withCredentials: true 
    });
    // 2. Clear Redux state
    dispatch({ type: LOGOUT });
    return true;
  } catch (error) {
    console.log('Logout failed:', error);
    return false;
  }
};

export const fetchTasks = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_TASKS_REQUEST });

    try {
      const response = await axios.get('http://localhost:5000/task/', {
        withCredentials: true
      });

      dispatch({ type: FETCH_TASKS_SUCCESS, payload: response.data });
      // console.log(response.data)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        dispatch({ type: FETCH_TASKS_FAILURE, payload: 'Unauthorized' });
      } else {
        dispatch({ type: FETCH_TASKS_FAILURE, payload: error.message });
      }
    }
  };
};

export const createTask = (taskData) => async (dispatch) => {
  dispatch({ type: CREATE_TASK_REQUEST });

  try {
    const response = await axios.post('http://localhost:5000/task/create', taskData, {
      withCredentials: true,
    });

    dispatch({
      type: CREATE_TASK_SUCCESS,
      payload: response.data.task,
    });

    // Return success flag and data
    return { 
      payload: response.data,
      success: true 
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
      message: errorMessage 
    };
  }
};

export const deleteTask = (id, token) => async (dispatch) => {
  dispatch({ type: DELETE_TASK_REQUEST });

  try {
    const res = await axios.delete(`http://localhost:5000/task/delete/${id}`, {
     withCredentials: true,
    });

    dispatch({ type: DELETE_TASK_SUCCESS, payload: id });
    return 'deleted'
  } catch (error) {
    dispatch({
      type: DELETE_TASK_FAILURE,
      payload: error.response?.data?.message || "Failed to delete task",
    });
    return 'failed'
  }
};

export const updateTask = (id, updatedData) => async (dispatch) => {
  dispatch({ type: FETCH_TASKS_REQUEST }); // optional: reuse for loader

  try {
    const res = await axios.patch(`http://localhost:5000/task/update/${id}`, updatedData, {
      withCredentials: true,
    });

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

export const setSearchQuery = (query) => ({
  type: SET_SEARCH_QUERY,
  payload: query,
});

export const assignTask = (taskData) => async (dispatch) => {
  dispatch({ type: ASSIGN_TASK_REQUEST });

  try {
    const response = await axios.post("http://localhost:5000/assignTask/", taskData, {
      withCredentials: true,
    });

    dispatch({ type: ASSIGN_TASK_SUCCESS });
    return "success";
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Something went wrong";

    dispatch({
      type: ASSIGN_TASK_FAILURE,
      payload: errorMessage,
    });

    if (errorMessage === "Recipient user not found") {
      return "Recipient user not found";
    }

    return "error";
  }
};

export const getAssignedTasks = () => async (dispatch) => {
  dispatch({ type: GET_ASSIGNED_TASKS_REQUEST });
  try {
    const response = await axios.get("http://localhost:5000/assignTask/", {
      withCredentials: true,
    });
    // console.log(response.data)
    dispatch({
      type: GET_ASSIGNED_TASKS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_ASSIGNED_TASKS_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch tasks",
    });
  }
};
