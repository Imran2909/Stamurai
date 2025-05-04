    import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from './actionTypes';

    const initialState = {
    isLoading: false,
    user: null,
    isError: null,
    };

    export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        return {
            ...state,
            isLoading: true,
            error: null,
        };
        case LOGIN_SUCCESS:
        return {
            ...state,
            isLoading: false,
            user: action.payload,
            error: null,
        };
        case LOGIN_FAILURE:
        return {
            ...state,
            isLoading: false,
            user: null,
            error: action.payload,
        };
        default:
        return state;
    }
    };
