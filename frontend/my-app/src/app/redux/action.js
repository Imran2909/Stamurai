import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
} from "./actionTypes";

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
