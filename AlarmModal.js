import { ScrollView, TouchableOpacity, Button, Modal, StyleSheet, Text, View, StatusBar, Pressable } from 'react-native';
import { Dimensions } from 'react-native'; //나중에 전역변수로 바꾸기
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getTime from './functions/getTime';
import { Switch } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function AlarmModal({ navigation, route }) {
  const [title, setTitle] = useState('');
  
    return (
      <View style={[StyleSheet.absoluteFill,{ backgroundColor: 'rgba(0, 0, 0, 0.3)' },]}>
        <View style={{ width: '95%', height: '95%', position: 'absolute', top: '2.5%', left: '2.5%', backgroundColor: 'white', borderRadius: 10 }}>
            <Text>AlarmModal</Text>  
            {/* 이거 누르면 오류 뻥뻥 */}
            {/* <Button title='go back edit' onPress={() => navigation.navigate('EditModal')}/> */}

        </View>
      </View>
    );


}
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
