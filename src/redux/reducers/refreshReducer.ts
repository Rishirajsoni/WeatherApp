import { REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_FAILURE } from '../constants';

const initialState = {
  loading: false,
  refreshError: null,
  accessToken: null,
  refreshToken: null,
};

const refreshReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case REFRESH_TOKEN_REQUEST:
      return { ...state, loading: true, refreshError: null };
    
    case REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        refreshError: null,
      };

    case REFRESH_TOKEN_FAILURE:
      return { ...state, loading: false, refreshError: action.payload };

    default:
      return state;
  }
};

export default refreshReducer;
