import {
  ASSIGN_TASK_REQUEST,
  ASSIGN_TASK_SUCCESS,
  ASSIGN_TASK_FAILURE,
  GET_ASSIGNED_TASKS_REQUEST,
  GET_ASSIGNED_TASKS_SUCCESS,
  GET_ASSIGNED_TASKS_FAILURE,
} from "./actionTypes";

const initialState = {
  loading: false,
  error: null,
  assignedTasks: [],
  assignRequests: 0,
};

const assignTaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case ASSIGN_TASK_REQUEST:
    case GET_ASSIGNED_TASKS_REQUEST:
      return { ...state, loading: true, error: null };
    case ASSIGN_TASK_SUCCESS:
      return { ...state, loading: false };
    case GET_ASSIGNED_TASKS_SUCCESS:
      return { ...state, loading: false, assignedTasks: action.payload };
    case ASSIGN_TASK_FAILURE:
    case GET_ASSIGNED_TASKS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default assignTaskReducer;
