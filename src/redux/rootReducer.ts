import { combineReducers } from 'redux';
import authReducer from './reducers/authReducer';
import refreshReducer from './reducers/refreshReducer';
import updateUserReducer from './reducers/updateUserReducer';
import fetchUserReducer from './reducers/fetchUserReducer';
import fetchWeatherReducer from './reducers/fetchWeatherReducer';
import forecastWeatherReducer from './reducers/forecastWeatherReducer';
import currentWeatherReducer from './reducers/currentWeatherReducer';

const rootReducer = combineReducers({
    auth : authReducer,
    refresh : refreshReducer,
    updateUser : updateUserReducer,
    getUser : fetchUserReducer,
    getWeather : fetchWeatherReducer,
    getForecastWeather : forecastWeatherReducer,
    getCurrentWeather: currentWeatherReducer,
});

export default rootReducer;