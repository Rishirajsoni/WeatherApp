import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, SafeAreaView, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import GetLocation from 'react-native-get-location'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

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
  const [currentWeather, setCurrentWeather] = useState<currentWeatherProps>();
  const [UserDetail, setUserDetail] = useState<any>('');
  const [visible, setVisible] = useState(false);


  const RefreshSession = async () => {
    const Refreshtoken = await AsyncStorage.getItem('Refreshtoken');
    const response = await fetch('https://dummyjson.com/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken: `${Refreshtoken}`,
      }),
      credentials: 'include'
    });
    const data = await response.json();
    if(response.ok || data.accessToken) {
      await AsyncStorage.setItem('token', (data.accessToken));
      await AsyncStorage.setItem('Refreshtoken', (data.refreshToken));
      Alert.alert('Session Refresh successfull');
     }else {
         Alert.alert('Refresh Session Failed');
     }
  };

  const scheduleTokenRefresh = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('No token found');
      return;
    }
    const decoded = jwtDecode(token);
    const expirationTime = decoded.exp * 1000;
    const refreshTime = expirationTime - 2 * 60 * 1000;
    const timeoutDuration = refreshTime - Date.now();
  
    if (Date.now() >= expirationTime) {
      await RefreshSession();
    } else if (timeoutDuration > 0) {
      setTimeout(async () => {
        await RefreshSession();
      }, timeoutDuration);
    } else {
      await RefreshSession();
    }
  };
  useEffect(() => {
    scheduleTokenRefresh();
  }, []);


  const fetchUserDetail = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch('https://dummyjson.com/auth/me', {
      method: 'GET',
      headers: { "Authorization": `Bearer ${token}` },
      credentials: 'include'
    });
    const data = await response.json();
    setUserDetail(data);
  };
  useEffect(() => {
    fetchUserDetail();
  }, []);

  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem('token');
      return true;
    } catch (exception) {
      return false;
    }
  };

  const handleLogout = async () => {
    const isLoggedOut = await logoutUser();
    if (isLoggedOut) {
      navigation.navigate("Login");
    } else {
      Alert.alert('Logout Failed');
    }
  };

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
        const weather = await currentLocationWeather(location.latitude, location.longitude);
        setCurrentWeather(weather);
      } catch (error) {
        console.warn('Error getting location:', error);
      }
    };
    getLocationAndWeather();
  }, []);

  const toggleProfile = () => {
    setVisible(!visible);
  };

  const fetchWeatherData: any = async (cityName: string) => {
    try {
      const apiKey = process.env.API_KEY;
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
      const apiKey = process.env.API_KEY;
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`
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
        latitude: weather.coord.lat,
        longitude: weather.coord.lon,
        date_stamp: weather.dt,
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
        latitude: weather.coord.lat,
        longitude: weather.coord.lon,
        date_stamp: weather.dt,
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
        <TouchableOpacity style={styles.ProfileButton} onPress={toggleProfile}>
          <Image
            style={styles.ProfileIcon}
            source={{ uri: `${UserDetail.image}` }}
          />
        </TouchableOpacity>
        <Modal
          visible={visible}
          onRequestClose={() => setVisible(false)}
          animationType="fade"
          transparent={true}
        >
          <TouchableOpacity onPress={toggleProfile} style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image style={styles.UserImage} source={{ uri: `${UserDetail.image}` }} />
              <View>
                <Text>{UserDetail.firstName} {UserDetail.lastName}</Text>
                <Text>{UserDetail.email}</Text>
              </View>
              <View>
                <TouchableOpacity style={styles.LogoutBtn} onPress={handleLogout}>
                  <Text style={styles.LogoutBtnText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      <View style={{ alignItems: 'center' }}>
        <Image style={styles.hero} source={require('../assets/images/default.png')} />
      </View>
      <View>
        <Text style={styles.title1}>Weather</Text>
        <Text style={styles.title2}>Forecast</Text>
      </View>
      {currentWeather && (
        <View style={styles.currentWeatherContainer}>
          <Text style={styles.currentWeatheHead}>Current Location Weather</Text>
          <Text style={styles.currentWeatherText}>
            Temperature: {currentWeather.main.temp}°C
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(6, 53, 66, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    zIndex: 10,
    padding: 10,
    position: 'absolute',
    borderRadius: 25,
    height: 400,
    width: 350,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  UserImage: {
    height: 100,
    width: 100,
    marginBottom: 30,
  },
  LogoutBtnText: {
    color: "#fff",
    fontSize: 18,
    justifyContent: 'center',
  },
  LogoutBtn: {
    backgroundColor: '#329932',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginTop: 40,
    width: 150,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
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
    borderRadius: 30,
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
  ProfileButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 5,
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
  ProfileIcon: {
    height: 50,
    width: 50,
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
  currentWeatheHead: {
    color: '#329932',
    fontSize: 18,
    fontWeight: '500',
  },
  currentWeatherText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
});


export default Intro;
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}