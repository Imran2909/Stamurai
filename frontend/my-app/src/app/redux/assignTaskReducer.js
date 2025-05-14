import {
  ASSIGN_TASK_REQUEST,
  ASSIGN_TASK_SUCCESS,
  ASSIGN_TASK_FAILURE,
  GET_ASSIGNED_TASKS_REQUEST,
  GET_ASSIGNED_TASKS_SUCCESS,
  GET_ASSIGNED_TASKS_FAILURE,
  NEW_ASSIGN_TASK_RECEIVED,
  UPDATE_TASK_STATUS,
  RESPOND_TO_TASK_REQUEST,
  INCREMENT_REQUEST_COUNT,
  DECREMENT_REQUEST_COUNT,
  TASK_ASSIGNED,
  EDIT_ASSIGNED_TASK_REQUEST,
  EDIT_ASSIGNED_TASK_SUCCESS,
  EDIT_ASSIGNED_TASK_FAILURE,
  DELETE_ASSIGNED_TASK_REQUEST,
  DELETE_ASSIGNED_TASK_SUCCESS,
  DELETE_ASSIGNED_TASK_FAILURE,
} from "./actionTypes";

const initialState = {
  loading: false,
  error: null,
  assignedTasks: {
    sent: [],
    received: [],
    requests: [],
  },
  assignRequests: 0,
  id: null,
};

const assignTaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case ASSIGN_TASK_REQUEST:
    case GET_ASSIGNED_TASKS_REQUEST:
    case EDIT_ASSIGNED_TASK_REQUEST:
    case DELETE_ASSIGNED_TASK_REQUEST:
    case RESPOND_TO_TASK_REQUEST:
      return { ...state, loading: true, error: null };

    case ASSIGN_TASK_SUCCESS:
      return { ...state, loading: false };

    case GET_ASSIGNED_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        assignedTasks: {
          sent: action.payload.sent,
          received: action.payload.received,
          requests: action.payload.received.filter(
            (t) => t.assignStatus === "requested"
          ),
        },
        assignRequests: action.payload.received.filter(
          (t) => t.assignStatus === "requested"
        ).length,
      };

    case NEW_ASSIGN_TASK_RECEIVED:
      const isRequest = action.payload.assignStatus === "requested";
      return {
        ...state,
        assignedTasks: {
          ...state.assignedTasks,
          received: [action.payload, ...state.assignedTasks.received],
          requests: isRequest
            ? [action.payload, ...state.assignedTasks.requests]
            : state.assignedTasks.requests,
        },
        assignRequests: isRequest
          ? state.assignRequests + 1
          : state.assignRequests,
      };

    case UPDATE_TASK_STATUS:
      return {
        ...state,
        assignedTasks: {
          sent: state.assignedTasks.sent.map((task) =>
            task._id === action.payload._id ? action.payload : task
          ),
          received: state.assignedTasks.received.map((task) =>
            task._id === action.payload._id ? action.payload : task
          ),
          requests: state.assignedTasks.requests.filter(
            (task) => task._id !== action.payload._id
          ),
        },
        assignRequests:
          action.payload.assignStatus === "requested"
            ? state.assignRequests
            : Math.max(0, state.assignRequests - 1),
      };

    case INCREMENT_REQUEST_COUNT:
      return {
        ...state,
        assignRequests: state.assignRequests + 1,
      };

    case DECREMENT_REQUEST_COUNT:
      return {
        ...state,
        assignRequests: Math.max(0, state.assignRequests - 1),
      };

    case ASSIGN_TASK_FAILURE:
    case GET_ASSIGNED_TASKS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case TASK_ASSIGNED:
      return { ...state, id: action.payload };

    case EDIT_ASSIGNED_TASK_SUCCESS: {
      const updatedTask = action.payload;
      const { sent = [], received = [] } = state.assignedTasks;

      return {
        ...state,
        loading: false,
        assignedTasks: {
          sent: sent.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          ),
          received: received.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          ),
        },
      };
    }

    case DELETE_ASSIGNED_TASK_SUCCESS: {
      const deletedTask = action.payload;
      const { sent = [], received = [] } = state.assignedTasks;

      return {
        ...state,
        loading: false,
        assignedTasks: {
          sent: sent.filter((task) => task._id !== deletedTask._id),
          received: received.filter((task) => task._id !== deletedTask._id),
        },
      };
    }

    case GET_ASSIGNED_TASKS_FAILURE:
    case EDIT_ASSIGNED_TASK_FAILURE:
    case DELETE_ASSIGNED_TASK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default assignTaskReducer;
