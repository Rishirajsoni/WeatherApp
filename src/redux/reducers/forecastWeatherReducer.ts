import { WeatherEntry } from '../../../Interface';
import {
    FORECAST_WEATHER_REQUEST,
    FORECAST_WEATHER_SUCCESS,
    FORECAST_WEATHER_FAILURE,
} from '../constants';

type ForecastState = {
    loading: boolean;
    forecastData: WeatherEntry | null;
    error: string | null;
}

const initialState: ForecastState = {
    loading: false,
    forecastData: null,
    error: null,
};

const forecastWeatherReducer = (state = initialState, action: any): ForecastState => {
    switch (action.type) {
        case FORECAST_WEATHER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FORECAST_WEATHER_SUCCESS:
            return {
                ...state,
                loading: false,
                forecastData: action.payload,
                error: null,
            };
        case FORECAST_WEATHER_FAILURE:
            return {
                ...state,
                loading: false,
                forecastData: null,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default forecastWeatherReducer;
