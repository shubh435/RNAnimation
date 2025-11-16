import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppleInvite from './screen/AppleInvite';
import HomeScreen from './screen/HomeScreen';
import CircularSlider from './screen/CircularSlider';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AppleInvite" component={AppleInvite} />
      <Stack.Screen name="CircularSlider" component={CircularSlider} />
    </Stack.Navigator>
  );
}

function MainScreen() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}

export default MainScreen;
