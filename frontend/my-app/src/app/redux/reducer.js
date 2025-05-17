
import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import taskReducer from "./taskReducer";
import assignTaskReducer from "./assignTaskReducer";

// Combine all reducers into a root reducer
const rootReducer = combineReducers({
  user: userReducer,          // Handles user auth, token, profile etc.
  task: taskReducer,          // Manages tasks: fetch, create, delete, filter
  assignTask: assignTaskReducer, // Manages assigned tasks and requests
});

export default rootReducer;
