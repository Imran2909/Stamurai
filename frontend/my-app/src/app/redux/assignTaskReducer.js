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

// Initial state shape for assigned tasks slice
const initialState = {
  loading: false, // Indicates if an async action is in progress
  error: null, // Stores error messages from failed actions
  assignedTasks: {
    sent: [], // Tasks assigned by current user
    received: [], // Tasks assigned to current user
    requests: [], // Pending assignment requests received
  },
  assignRequests: 0, // Count of pending assignment requests
  id: null, // Holds ID of a recently assigned task (optional usage)
};

const assignTaskReducer = (state = initialState, action) => {
  switch (action.type) {
    // Start of async actions — set loading, clear errors
    case ASSIGN_TASK_REQUEST:
    case GET_ASSIGNED_TASKS_REQUEST:
    case EDIT_ASSIGNED_TASK_REQUEST:
    case DELETE_ASSIGNED_TASK_REQUEST:
    case RESPOND_TO_TASK_REQUEST:
      return { ...state, loading: true, error: null };

    // Successfully assigned a task (no state change beyond loading)
    case ASSIGN_TASK_SUCCESS:
      return { ...state, loading: false };

    // Got all assigned tasks — update lists & request count
    case GET_ASSIGNED_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        assignedTasks: {
          sent: action.payload.sent,
          received: action.payload.received,
          requests: action.payload.received.filter(
            (task) => task.assignStatus === "requested"
          ),
        },
        assignRequests: action.payload.received.filter(
          (task) => task.assignStatus === "requested"
        ).length,
      };

    // New assigned task received (likely via socket)
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
        assignRequests: isRequest ? state.assignRequests + 1 : state.assignRequests,
      };

    // Update task status for assigned tasks
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
          // Remove from requests if status changed
          requests: state.assignedTasks.requests.filter(
            (task) => task._id !== action.payload._id
          ),
        },
        assignRequests:
          action.payload.assignStatus === "requested"
            ? state.assignRequests
            : Math.max(0, state.assignRequests - 1),
      };

    // Increment pending assignment request count
    case INCREMENT_REQUEST_COUNT:
      return { ...state, assignRequests: state.assignRequests + 1 };

    // Decrement pending assignment request count (but not below 0)
    case DECREMENT_REQUEST_COUNT:
      return { ...state, assignRequests: Math.max(0, state.assignRequests - 1) };

    // Error handling for assign & fetch failures
    case ASSIGN_TASK_FAILURE:
    case GET_ASSIGNED_TASKS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Store ID of last assigned task (optional, maybe for UI feedback)
    case TASK_ASSIGNED:
      return { ...state, id: action.payload };

    // Successfully edited an assigned task - update lists with new data
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
          requests: state.assignedTasks.requests, // no change needed here
        },
      };
    }

    // Successfully deleted an assigned task - filter it out
    case DELETE_ASSIGNED_TASK_SUCCESS: {
      const deletedTask = action.payload;
      const { sent = [], received = [] } = state.assignedTasks;

      return {
        ...state,
        loading: false,
        assignedTasks: {
          sent: sent.filter((task) => task._id !== deletedTask._id),
          received: received.filter((task) => task._id !== deletedTask._id),
          requests: state.assignedTasks.requests, // keep requests intact
        },
      };
    }

    // Handle failures on assigned tasks edit & delete
    case EDIT_ASSIGNED_TASK_FAILURE:
    case DELETE_ASSIGNED_TASK_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Default case: just return current state
    default:
      return state;
  }
};

export default assignTaskReducer;
