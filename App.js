import { Button, StyleSheet, Text, View, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
// import GoogleLogin from './GoogleLogin';
// import NomalLogin from './NomalLogin';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ///////////////////////
import Home from './src/Home';
import WritePage from './src/WritePage';
import EditPage from './src/EditPage';

import WriteModal from './src/WriteModal';
import EditModal from './src/EditModal';
import ReviewPage from './src/ReviewPage';
// import AlarmModal from './AlarmModal';

// import TimeSettingPage from './TimeSettingPage';
import Test from './Test';

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
// import 'expo-dev-client'




export default function App() {  
  const Stack = createNativeStackNavigator();
  return (
      <NavigationContainer>
      <Stack.Navigator  screenOptions={{headerShown: false, animation: 'none'  }}>
        {/* <Stack.Screen name="Test" component={Test} /> */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="WritePage" component={WritePage} />
        <Stack.Screen name="EditPage" component={EditPage} />
        <Stack.Screen name="ReviewPage" component={ReviewPage} />

        {/* <Stack.Screen name="TimeSettingPage" component={TimeSettingPage} /> */}
        
      <Stack.Group >
        <Stack.Screen name="WriteModal" component={WriteModal} options={{ presentation: 'transparentModal' }} />
        <Stack.Screen name="EditModal" component={EditModal} options={{ presentation: 'transparentModal' }} />
        {/* <Stack.Screen name="AlarmModal" component={AlarmModal} options={{ presentation: 'transparentModal' }} /> */}

      </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
  },
  one: {
    backgroundColor: '#fff',
  },
});
