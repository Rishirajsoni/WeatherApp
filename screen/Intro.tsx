import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, SafeAreaView, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, TouchableWithoutFeedback } from 'react-native';
import GetLocation from 'react-native-get-location'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { cardDetail, refreshToken, userDetail, weatherData } from '../Interface';

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
  const [currentWeather, setCurrentWeather] = useState<weatherData | null | undefined>();
  const [UserDetail, setUserDetail] = useState<any>('');
  const [visible, setVisible] = useState(false);
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setEmail] = useState('');
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);


  const refreshSession = async () => {
    const refreshToken = await AsyncStorage.getItem('Refreshtoken');
    const response = await fetch(`${process.env.DUMMY_API_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken: `${refreshToken}`,
        expiresInMins: 5,
      }),
      credentials: 'include'
    });
    const data: refreshToken = await response.json();
    if (response.ok || data.accessToken) {
      await AsyncStorage.setItem('token', (data.accessToken));
      await AsyncStorage.setItem('Refreshtoken', (data.refreshToken));
      Alert.alert('Session Refresh successfull');
    } else {
      Alert.alert('Refresh Session Failed');
      handleLogout();
    }
  };

  const scheduleTokenRefresh = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('No token found');
      return;
    }
    const decoded = jwtDecode(token);
    const expirationTime = (decoded.exp ?? 0) * 1000;
    const refreshTime = expirationTime - 2 * 60 * 1000;
    const timeoutDuration = refreshTime - Date.now();

    if (Date.now() >= expirationTime) {
      await refreshSession();
    } else if (timeoutDuration > 0) {
      setTimeout(async () => {
        await refreshSession();
      }, timeoutDuration);
    } else {
      await refreshSession();
    }
  };
  useEffect(() => {
    scheduleTokenRefresh();
  }, []);


  const updateUserDetails = async () => {
    const response = await fetch('https://dummyjson.com/users/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: FirstName,
        lastName: LastName,
        email: Email
      })
    });
    const data: userDetail = await response.json();
    setUserDetail(data);
    setFirstName('');
    setLastName('');
    setEmail('');
    setIsUpdateSuccessful(true);
    setTimeout(() => {
      setIsUpdateSuccessful(false);
    }, 5000);
  };

  const fetchUserDetail = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${process.env.DUMMY_API_URL}/me`, {
      method: 'GET',
      headers: { "Authorization": `Bearer ${token}` },
      credentials: 'include'
    });
    const data: userDetail = await response.json();
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

  const fetchWeatherData = async (cityName: string) => {
    try {
      const apiKey = process.env.API_KEY;
      const response = await fetch(
        `${process.env.API_URL}?q=${cityName}&appid=${apiKey}&units=metric`
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
      const response = await fetch(`${process.env.API_URL}?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`);
      const data: weatherData = await response.json();
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
    const weather: weatherData = await fetchWeatherData(searchText);
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
      Alert.alert('City not found. Please try another city.');
    }
  };

  const onPressLearnMore = async (name: string) => {
    const weather: weatherData = await fetchWeatherData(name);
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

  const Card = (item: cardDetail) => (
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
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setVisible(false)}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                  <Text style={styles.logoutBtnText}>Logout</Text>
                </TouchableOpacity>
                <Image style={styles.userImage} source={{ uri: `${UserDetail.image}` }} />
                <Text style={styles.title}>Update Profile</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={UserDetail.firstName}
                    value={FirstName}
                    onChangeText={(text) => setFirstName(text)}
                  />
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={UserDetail.lastName}
                    value={LastName}
                    onChangeText={(text) => setLastName(text)}
                  />
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={UserDetail.email}
                    value={Email}
                    onChangeText={(text) => setEmail(text)}
                  />
                </View>
                {isUpdateSuccessful && (
                  <Text style={styles.updateSuccess}>Update Successful!</Text>
                )}
                <TouchableOpacity style={styles.btn} onPress={updateUserDetails}>
                  <Text style={styles.btnText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
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
          {cards.map((item: cardDetail) => (
            <Card name={item.name} temp={item.temp} key={item.name} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 360,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  userImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#329932",
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  updateSuccess: {
    color: "#4CAF50",
    fontStyle: "italic",
    marginVertical: 10,
  },
  btn: {
    backgroundColor: "#329932",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutBtn: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#ff4d4d",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  logoutBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
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