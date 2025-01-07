import React from 'react';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import Intro from './screen/Intro';
import Home from './screen/Home';
import Login from './screen/login';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { Appearance } from 'react-native';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  Appearance.setColorScheme('light');
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Intro" component={Intro} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;