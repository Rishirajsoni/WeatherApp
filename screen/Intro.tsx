import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

  const fetchWeatherData = async (cityName: string) => {
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
      <Text>{item.temp !== null ? `${item.temp}°C` : 'Loading...'}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.background}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search City"
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        onSubmitEditing={handleSearchSubmit}
      />
      <View style={{ alignItems: 'center' }}>
        <Image style={styles.hero} source={require('../assets/images/default.png')} />
      </View>
      <View>
        <Text style={styles.title1}>Weather</Text>
        <Text style={styles.title2}>Forecast</Text>
      </View>
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
    marginTop: 90,
    width: 300,
    height: 250,
  },
  title1: {
    fontSize: 40,
    color: '#ffffff',
    textAlign: 'center',
  },
  title2: {
    fontSize: 42,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#329932',
    textAlign: 'center',
    marginBottom: 50,
  },
  searchBar: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    padding: 10,
    margin: 10,
    fontSize: 18,
    color: 'black',
  },
  card: {
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    padding: 50,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: 'black',
    fontSize: 20,
    marginBottom: 5,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
  },
  background: {
    backgroundColor: '#05014a',
    height: 900,
  },
});

export default Intro;
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}

