import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGOUT,
  STOP,
} from "./actionTypes";

const initialState = {
  isLoading: false,
  token: null,
  isError: false,
  data: [],
  signupSuccess: false,
  username:null
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: null,
      };
    case SIGNUP_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        token: action.payload[0],
        isError: null,
        username:action.payload[1]
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: null,
        signupSuccess: true,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        user: null,
        isError: action.payload,
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        isLoading: false,
        user: null,
        isError: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        token: null, // Make sure this is explicitly set to null
        isLoading: false,
        isError: null,
      };
    case STOP:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};
