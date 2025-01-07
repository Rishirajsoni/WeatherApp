import {
    CURRENT_WEATHER_REQUEST,
    CURRENT_WEATHER_SUCCESS,
    CURRENT_WEATHER_FAILURE,
  } from "../constants";
  
  interface WeatherState {
    loading: boolean;
    weatherData: any | null;
    error: string | null;
  }
  
  const initialState: WeatherState = {
    loading: false,
    weatherData: null,
    error: null,
  };
  
  const currentWeatherReducer = (state = initialState, action: any): WeatherState => {
    switch (action.type) {
      case CURRENT_WEATHER_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case CURRENT_WEATHER_SUCCESS:
        return {
          ...state,
          loading: false,
          weatherData: action.payload,
          error: null,
        };
      case CURRENT_WEATHER_FAILURE:
        return {
          ...state,
          loading: false,
          weatherData: null,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default currentWeatherReducer;
  