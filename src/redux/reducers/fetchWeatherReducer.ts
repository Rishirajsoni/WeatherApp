import { FETCH_WEATHER_REQUEST, FETCH_WEATHER_SUCCESS, FETCH_WEATHER_FAILURE } from '../constants';

type WeatherState = {
    loading: boolean;
    weatherData: any | null;
    error: string | null;
}

const initialState: WeatherState = {
    loading: false,
    weatherData: null,
    error: null,
};

const fetchWeatherReducer = (state = initialState, action: any): WeatherState => {
    switch (action.type) {
        case FETCH_WEATHER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_WEATHER_SUCCESS:
            return {
                ...state,
                loading: false,
                weatherData: action.payload,
            };
        case FETCH_WEATHER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default fetchWeatherReducer;
