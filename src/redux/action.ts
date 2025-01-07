import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT ,
    REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_FAILURE,
    UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE,
    FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE,
    FETCH_WEATHER_REQUEST, FETCH_WEATHER_SUCCESS, FETCH_WEATHER_FAILURE,
    FORECAST_WEATHER_FAILURE, FORECAST_WEATHER_REQUEST, FORECAST_WEATHER_SUCCESS,
    CURRENT_WEATHER_REQUEST, CURRENT_WEATHER_FAILURE, CURRENT_WEATHER_SUCCESS,
} from './constants';
import { Dispatch } from 'redux';
import { ForecastResponse, WeatherEntry } from '../../Interface';

export const login = (username: string, password: string) => {
    return async (dispatch: Dispatch) => {
        dispatch({ type: LOGIN_REQUEST });
        const response = await fetch(`${process.env.DUMMY_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                password,
                expiresInMins: 5,
            }),
        });

        const data = await response.json();

        if (response.ok && data.accessToken) {
            await AsyncStorage.setItem('token', data.accessToken);
            await AsyncStorage.setItem('Refreshtoken', data.refreshToken);
            dispatch({ type: LOGIN_SUCCESS, payload: data });
        } else {
            dispatch({ type: LOGIN_FAILURE, payload: 'Failed login' });
        }
    };
};

export const logoutUser = () => {
    return async(dispatch: Dispatch) => {
        dispatch({ type: LOGOUT });
        await AsyncStorage.removeItem('token');
    };
};

export const refreshtoken = () => {
    return async (dispatch: Dispatch) => {
        dispatch({ type: REFRESH_TOKEN_REQUEST });
        const refreshToken = await AsyncStorage.getItem('Refreshtoken');
        const response = await fetch(`${process.env.DUMMY_API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                refreshToken: `${refreshToken}`,
                expiresInMins: 5,
            }),
            credentials: 'include'
        });
        const data = await response.json();
        if (response.ok || data.accessToken) {
            await AsyncStorage.setItem('token', (data.accessToken));
            await AsyncStorage.setItem('Refreshtoken', (data.refreshToken));
            dispatch({ type: REFRESH_TOKEN_SUCCESS, payload: data });
        } else {
            dispatch({ type: REFRESH_TOKEN_FAILURE, payload: 'Refresh Session Failed' });
        }
    }
};

export const updateUserDetails = (FirstName: string, LastName: string, Email: string) => {
    return async (dispatch: Dispatch) => {
        dispatch({ type: UPDATE_USER_REQUEST });
        const response = await fetch(`${process.env.DUMMY_API_URL}/users/1`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: FirstName,
                lastName: LastName,
                email: Email
            })
        });
        const userData = await response.json();
        // console.log('User data from redux',userData);
        if (response.ok) {
            dispatch({ type: UPDATE_USER_SUCCESS, payload: userData });
            return userData;
        } else {
            dispatch({ type: UPDATE_USER_FAILURE, payload: 'Failed to update user details.' });
        }
    };
};

export const fetchUserDetail = () => {
    return async (dispatch: Dispatch) => {
        dispatch({ type: FETCH_USER_REQUEST });
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${process.env.DUMMY_API_URL}/auth/me`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${token}` },
            credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
            dispatch({ type: FETCH_USER_SUCCESS, payload: data });
            return data;
        } else {
            dispatch({ type: FETCH_USER_FAILURE, payload: 'Failed to Fetch user details.' });
        }
    };
};

export const fetchWeatherData = (cityName: string) => {
    return async (dispatch: Dispatch) => {
        dispatch({ type: FETCH_WEATHER_REQUEST });
        const apiKey = process.env.API_KEY;
        const response = await fetch(
            `${process.env.API_URL}?q=${cityName}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        if (data.cod === 200) {
            dispatch({ type: FETCH_WEATHER_SUCCESS, payload: data });
            return data;
        } else {
            dispatch({ type: FETCH_WEATHER_FAILURE, payload: 'Failed to Fetch Weather Data.' });
        }
    };
};


export const forecastWeatherData = (dayOffset: number, data_stamp : number, latitude : number, longitude : number) => {
    return async (dispatch: Dispatch) => {
        dispatch({ type: FORECAST_WEATHER_REQUEST });
        const interval = 3 * 60 * 60;
        const next_dt = (Math.floor(data_stamp / interval) + 1) * interval;
        const targetDT = next_dt + dayOffset * 86400;
        const apiKey = process.env.API_KEY;
        const response = await fetch(
            `${process.env.API_URL_FORECAST}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        const data: ForecastResponse = await response.json();
        const forecast = data.list.find((entry: WeatherEntry) => entry.dt === targetDT);
        if (forecast) {
            dispatch({ type: FORECAST_WEATHER_SUCCESS, payload: forecast });
        } else {
            dispatch({ type: FORECAST_WEATHER_FAILURE, payload: 'Failed to Fetch Forecast Weather Data.' });
        }
    };
};

  export const currentLocationWeather = (lat: number, long: number) => {
    return async (dispatch: Dispatch) => {
        dispatch({ type: CURRENT_WEATHER_REQUEST });
      const apiKey = process.env.API_KEY;
      const response = await fetch(`${process.env.API_URL}?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`);
      const data = await response.json();
      if (data.cod === 200) {
        dispatch({ type: CURRENT_WEATHER_SUCCESS, payload: data });
      } else {
        dispatch({ type: CURRENT_WEATHER_FAILURE, payload: 'Failed to Fetch Current Weather Data.' });
        return null;
      }
   };
  };