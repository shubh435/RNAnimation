import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppleInvite from './screen/AppleInvite';
import HomeScreen from './screen/HomeScreen';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="AppleInvite"
        options={{ headerShown: false }}
        component={AppleInvite}
      />
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
