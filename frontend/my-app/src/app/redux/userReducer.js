import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGOUT,
} from "./actionTypes";

const initialState = {
  isLoading: false,
  token: null,
  isError: null,      // changed from boolean to null/string for error messages
  data: [],           // not currently used? Consider removing if unused
  signupSuccess: false,
  username: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case SIGNUP_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: null,  // reset error on new request
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        token: action.payload[0],      // store token
        username: action.payload[1],   // store username
        isError: null,
      };

    case SIGNUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        signupSuccess: true,           // flag signup success
        isError: null,
      };

    case LOGIN_FAILURE:
    case SIGNUP_FAILURE:
      return {
        ...state,
        isLoading: false,
        token: null,       // clear token on failure
        isError: action.payload, // store error message
      };

    case LOGOUT:
      return {
        ...state,
        token: null,       // clear token on logout
        username: null,    // clear username on logout
        isLoading: false,
        isError: null,
      };


    default:
      return state; 
  }
};
