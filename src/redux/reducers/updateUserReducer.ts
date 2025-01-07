import { UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE } from "../constants";
  
  type UserState = {
    loading: boolean;
    user: { firstName: string; lastName: string; email: string;} | null;
    updateError: string | null;
    isUpdateSuccessful: boolean;
  }
  
  const initialState: UserState = {
    loading: false,
    user: null,
    updateError: null,
    isUpdateSuccessful: false,
  };
  
  const updateUserReducer = (state = initialState, action: any): UserState => {
    switch (action.type) {
      case UPDATE_USER_REQUEST:
        return { ...state, loading: true, updateError: null, isUpdateSuccessful: false };
      case UPDATE_USER_SUCCESS:
        return {
          ...state,
          loading: false,
          user: action.payload,
          updateError: null,
          isUpdateSuccessful: true,
        };
      case UPDATE_USER_FAILURE:
        return { ...state, loading: false, updateError: action.payload, isUpdateSuccessful: false };
      default:
        return state;
    }
  };
  
  export default updateUserReducer;
  