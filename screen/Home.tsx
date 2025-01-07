import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../src/redux/hooks';
import { RootState } from '../src/redux/store';
import { forecastWeatherData } from '../src/redux/action';

const Home = () => {
  const navigation = useNavigation();
  const weatherDataRedux = useAppSelector((state: RootState) => state.getWeather.weatherData);
  const forecastDataRedux = useAppSelector((state: RootState) => state.getForecastWeather.forecastData);
  const loading = useAppSelector((state: RootState) => state.getWeather.loading);
  const dispatch = useAppDispatch();

  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState('default');
  const [forecastWeather, setForecastWeather] = useState<any>(null);
  
  useEffect(() => {
    if (weatherDataRedux) {
      setForecastWeather({
        temperature: weatherDataRedux.main?.temp,
        feels_like: weatherDataRedux.main?.feels_like,
        description: weatherDataRedux.weather[0]?.description,
      });
    }
  }, [weatherDataRedux]);

  useEffect(() => {
    if(forecastDataRedux){
      setForecastWeather({
        temperature: forecastDataRedux.main?.temp,
        feels_like: forecastDataRedux.main?.feels_like,
        description: forecastDataRedux.weather[0]?.description,
      });}
  }, [forecastDataRedux]);
 
  const getWeatherImage = (description: string) => {
    switch (description?.toLowerCase()) {
      case 'haze':
        return require('../assets/images/haze.png');
      case 'rain':
        return require('../assets/images/rainy.png');
      case 'clear sky':
        return require('../assets/images/clear_sky.png');
      case 'clouds':
        return require('../assets/images/cloudy.png');
      case 'smoke':
        return require('../assets/images/smoke.png');
      default:
        return require('../assets/images/default.png');
    }
  };

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const handleRadioButtonChange = (value: string) => {
    setChecked(value);

    const dayOffsetMapping: { [key: string]: number } = {
      default: 0,
      first: 1,
      second: 2,
      third: 3,
    };

    const dayOffset = dayOffsetMapping[value];

    if (value === "default") {
      setForecastWeather({
        temperature: weatherDataRedux.main?.temp,
        feels_like: weatherDataRedux.main?.feels_like,
        description: weatherDataRedux.weather[0]?.description,
      });
    } else {
      dispatch(forecastWeatherData(dayOffset , weatherDataRedux.dt , weatherDataRedux.coord.lat , weatherDataRedux.coord.lon));
    }
    toggleDropdown();
  };

  const renderDropdown = () => {
    if (visible) {
      return (
        <View style={styles.dropdown}>
          <Text>Select Filter</Text>
          <RadioButton.Group
            onValueChange={handleRadioButtonChange}
            value={checked}
          >
            <View>
              <RadioButton.Item label="Today" value="default" />
            </View>
            <View>
              <RadioButton.Item label="Tomorrow" value="first" />
            </View>
            <View>
              <RadioButton.Item label="After 1 day" value="second" />
            </View>
            <View>
              <RadioButton.Item label="After 2 days" value="third" />
            </View>
          </RadioButton.Group>
        </View>
      );
    }
  };

  if (loading || !forecastWeather) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
        <Text>Loading Weather Data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterButton} onPress={toggleDropdown}>
        {renderDropdown()}
        <Image style={styles.filtericon} source={require('../assets/icons/filter.png')} />
      </TouchableOpacity>

      <Image
        style={styles.weatherImage}
        source={getWeatherImage(forecastWeather?.description || weatherDataRedux.weather[0].description)}
      />
      <Text style={styles.cityName}>{weatherDataRedux.name}</Text>
      <Text style={styles.temp}>
        {forecastWeather ? `${forecastWeather.temperature}°C` : `${weatherDataRedux.main.temp}°C`}
      </Text>
      <Text style={styles.feelsLike}>
        Feels like: {forecastWeather ? `${forecastWeather.feels_like}°C` : `${weatherDataRedux.main.feels_like}°C`}
      </Text>
      <Text style={styles.weatherDescription}>
        Weather: {forecastWeather ? forecastWeather.description : weatherDataRedux.weather[0].description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#329932',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterButton: {
    backgroundColor: '#329932',
    position: 'absolute',
    top: 40,
    right: 20,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  filtericon: {
    height: 20,
    width: 20,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temp: {
    fontSize: 32,
    color: '#329932',
    marginVertical: 10,
  },
  feelsLike: {
    fontSize: 20,
    marginVertical: 5,
  },
  weatherDescription: {
    fontSize: 18,
    color: '#666',
  },
  weatherImage: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  dropdown: {
    zIndex: 10,
    padding: 10,
    position: 'absolute',
    borderRadius: 5,
    height: 250,
    width: 180,
    backgroundColor: '#fff',
    top: 60,
    right: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
});

export default Home;
