import { FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE } from "../constants";
  
  type UserState = {
    loading: boolean;
    user: any | null;
    fetchError: string | null;
    isFetchSuccessful: boolean;
  }
  
  const initialState: UserState = {
    loading: false,
    user: null,
    fetchError: null,
    isFetchSuccessful: false,
  };
  
  const fetchUserReducer = (state = initialState, action: any): UserState => {
    switch (action.type) {
      case FETCH_USER_REQUEST:
        return { ...state, loading: true, fetchError: null, isFetchSuccessful: false };
      case FETCH_USER_SUCCESS:
        return {
          ...state,
          loading: false,
          user: action.payload,
          fetchError: null,
          isFetchSuccessful: true,
        };
      case FETCH_USER_FAILURE:
        return { ...state, loading: false, fetchError: action.payload, isFetchSuccessful: false };
      default:
        return state;
    }
  };
  
  export default fetchUserReducer;
  