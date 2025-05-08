import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import taskReducer from "./taskReducer";
import assignTaskReducer from "./assignTaskReducer";

const rootReducer = combineReducers({
  user: userReducer,
  task: taskReducer,
  assignTask: assignTaskReducer,
});

export default rootReducer;

