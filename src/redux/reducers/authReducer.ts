import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../constants';

const initialState = {
    loading: false,
    user: null,
    error: null,
};

const authReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return { ...state, loading: true, error: null };
        case LOGIN_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: null };
        case LOGIN_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case LOGOUT:
            return { ...state, loading: false, user: null, error: null };
        default:
            return state;
    }
};

export default authReducer;
