import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Home = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { name, temp, feelsLike, description } = route?.params ?? {};

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

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Weather Information */}
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default Home;
