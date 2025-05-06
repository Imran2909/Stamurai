import {
  FETCH_TASKS_REQUEST,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAILURE,
  CREATE_TASK_SUCCESS,
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAILURE,
} from "./actionTypes";

const initialState = {
  loading: false,
  error: null,
  tasks: [],
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASKS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_TASKS_SUCCESS:
      return { ...state, loading: false, tasks: action.payload };
    case CREATE_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: [...state.tasks, action.payload],
      };
    case FETCH_TASKS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_TASK_REQUEST:
      return { ...state, loading: true, error: null };
    case DELETE_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: state.tasks.filter((task) => task._id !== action.payload),
      };
    case DELETE_TASK_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default taskReducer;
