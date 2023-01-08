// import { StatusBar } from 'expo-status-bar';
import { Button, Modal, StyleSheet, Text, View, Pressable, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Dimensions } from 'react-native'; //나중에 전역변수로 바꾸기

import { RadioButton } from 'react-native-paper'; // radio button

import AsyncStorage from '@react-native-async-storage/async-storage';

import getTime from './functions/getTime';

import * as Notifications from 'expo-notifications';

import { Switch } from 'react-native';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


export default function TimeSettingPage({ navigation, route }) {

    return (
        <View>
            <Text>timesettingpage</Text>
        </View>
    );
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        backgroundColor: 'white',
        width: 350,
        height: 500,

    },
    qwer: {
        backgroundColor: '#DDD',
        width: 50,
    },

});
