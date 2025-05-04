import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { taskReducer } from "./taskReducer";

const rootReducer = combineReducers({
  user: userReducer,
  task: taskReducer,
});

export default rootReducer;
