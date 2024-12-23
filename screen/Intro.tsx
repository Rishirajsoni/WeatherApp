import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import GetLocation from 'react-native-get-location'
import { RadioButton } from 'react-native-paper';

type currentWeatherProps = {
  main: {
    temp: number;
  },
  weather: [{ description: string }]
}
const Intro = () => {
  const navigation = useNavigation<any>();
  const [cards, setCards] = useState([
    { name: 'Delhi', temp: null },
    { name: 'Mumbai', temp: null },
    { name: 'Gurugram', temp: null },
    { name: 'Pune', temp: null },
    { name: 'Bengaluru', temp: null },
  ]);
  const [searchText, setSearchText] = useState('');
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, long: 0 });
  const [currentWeather, setCurrentWeather] = useState<currentWeatherProps>();
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState('first');
  const yesterdayTimestamp = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

  useEffect(() => {
    const fetchAllWeatherData = async () => {
      const updatedCards = await Promise.all(
        cards.map(async (card) => {
          const weather = await fetchWeatherData(card.name);
          return weather
            ? { ...card, temp: weather.main.temp }
            : card;
        })
      );
      setCards(updatedCards);
    };

    fetchAllWeatherData();
  }, []);

  useEffect(() => {
    const getLocationAndWeather = async () => {
      try {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 60000,
        });


        setCurrentLocation({ lat: location.latitude, long: location.longitude });
        const weather = await currentLocationWeather(location.latitude, location.longitude);
        setCurrentWeather(weather);
      } catch (error) {
        console.warn('Error getting location:', error);
      }
    };
    getLocationAndWeather();
  }, []);

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

  const fetchWeatherData: any = async (cityName: string) => {
    try {
      const apiKey = '41bad86193eaf4b4ffcdea63ed063f66';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      if (data.cod === 200) {
        return data;
      } else {
        console.error(`City not found: ${data.message}`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };

  const currentLocationWeather = async (lat: number, long: number) => {
    try {
      const apiKey = '41bad86193eaf4b4ffcdea63ed063f66';
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`
      );
      const data = await response.json();
      if (data.cod === 200) {
        return data;
      } else {
        console.error(`Location not Found: ${data.message}`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };

  const handleSearchSubmit = async () => {
    const weather = await fetchWeatherData(searchText);
    if (weather) {
      navigation.navigate('Home', {
        name: weather.name,
        temp: weather.main.temp,
        feelsLike: weather.main.feels_like,
        description: weather.weather[0].description,
      });
      setSearchText('');
    } else {
      alert('City not found. Please try another city.');
    }
  };

  const onPressLearnMore = async (name: string) => {
    const weather = await fetchWeatherData(name);
    if (weather) {
      navigation.navigate('Home', {
        name: weather.name,
        temp: weather.main.temp,
        feelsLike: weather.main.feels_like,
        description: weather.weather[0].description,
      });
    }
  };

  const Card = ({ item }: any) => (
    <TouchableOpacity
      key={item.name}
      style={styles.card}
      onPress={() => onPressLearnMore(item.name)}
    >
      <Text style={styles.cardText}>{item.name}</Text>
      <Text style={styles.cardtemp}>{item.temp !== null ? `${item.temp}°C` : 'Loading...'}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Image style={styles.searchicon} source={require('../assets/icons/search.png')} />
          <TextInput
            placeholder="Search City"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            onSubmitEditing={handleSearchSubmit}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={toggleDropdown}>
          {renderDropdown()}
          <Image style={styles.filtericon} source={require('../assets/icons/filter.png')} />
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center'}}>
        <Image style={styles.hero} source={require('../assets/images/default.png')} />
      </View>
      <View>
        <Text style={styles.title1}>Weather</Text>
        <Text style={styles.title2}>Forecast</Text>
      </View>
      {currentWeather && (
        <View style={styles.currentWeatherContainer}>
          <Text style={styles.currentWeatherText}>Current Location</Text>
          <Text style={styles.currentWeatherText}>
            Temperature: {(currentWeather.main.temp - 273.15).toFixed(2)}°C
          </Text>
          <Text style={styles.currentWeatherText}>
            Description: {currentWeather.weather[0]?.description}
          </Text>
        </View>
      )}
      <ScrollView horizontal={true}>
        <View style={styles.cardContainer}>
          {cards.map((item) => (
            <Card item={item} key={item.name} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  hero: {
    marginTop: 30,
    width: 250,
    height: 250,
  },
  title1: {
    fontSize: 40,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '300',
  },
  title2: {
    fontSize: 42,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#329932',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: 300,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 20,
  },
  filterButton: {
    backgroundColor: '#329932',
    borderRadius: 25,
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
  searchicon: {
    height: 20,
    width: 20,
  },
  filtericon: {
    height: 20,
    width: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 40,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
  },
  cardtemp: {
    color: 'black',
    fontSize: 15,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  background: {
    backgroundColor: '#05014a',
    height: '100%',
  },
  currentWeatherContainer: {
    backgroundColor: '#080271',
    borderRadius: 25,
    padding: 20,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  currentWeatherText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
  dropdown: {
    zIndex:10,
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
  // radioItem: {
  //   marginBottom: 10,
  // },
});


export default Intro;
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}