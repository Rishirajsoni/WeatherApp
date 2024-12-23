import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';

const Home = () => {
  const navigation = useNavigation();
  type RouteParams = {
    params: {
      name: string;
      temp: number;
      feelsLike: number;
      description: string;
    };
  };

  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const { name, temp, feelsLike, description } = route.params ?? {};

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
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState('first');

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const renderDropdown = () => {
    if (visible) {
      return (
        <View style={styles.dropdown}>
          <Text>
            Select Filter
          </Text>
          <RadioButton.Group
            onValueChange={value => setChecked(value)}
            value={checked}
          >
            <View>
              <RadioButton.Item label="Yestaurday" value="first" />
            </View>
            <View>
              <RadioButton.Item label="1 Day ago" value="second" />
            </View>
            <View>
              <RadioButton.Item label="2 Day ago" value="third" />
            </View>
          </RadioButton.Group>
        </View>
      );
    }
  };

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

      <Image style={styles.weatherImage} source={getWeatherImage(description)} />
      <Text style={styles.cityName}>{name}</Text>
      <Text style={styles.temp}>{temp}°C</Text>
      <Text style={styles.feelsLike}>Feels like: {feelsLike}°C</Text>
      <Text style={styles.weatherDescription}>Weather: {description}</Text>
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
    height: 200,
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
