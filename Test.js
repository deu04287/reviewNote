import { ScrollView, TouchableOpacity, Button, Modal, StyleSheet, Text, View, StatusBar, Pressable } from 'react-native';
import { Dimensions } from 'react-native'; //나중에 전역변수로 바꾸기
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Test() {
  const [store, setStore] = useState([]);

  const [toggle1, setToggle1] = useState(500);
  const [toggle2, setToggle2] = useState([]);

  // console.log(JSON.stringify(store[0]));
  return (
    <View style={{flex:1}}>

      <View style={{flex:1}}>
      <View style={{backgroundColor:"red"}}>
        <Text>one</Text>
      </View>
      <View style={{height:toggle1,backgroundColor:"blue"}}>
      <Text>two</Text>
      </View>
      </View>
      <Button title='sdaf' onPress={ () => { setToggle1(0)} }></Button>
    </View>
  );
};