import { ScrollView, TouchableOpacity, Button, Modal, StyleSheet, Text, View, StatusBar, Pressable } from 'react-native';
import { Dimensions } from 'react-native'; //나중에 전역변수로 바꾸기
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Test() {
  const [store, setStore] = useState([]);

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function getBanana() {
    await delay(2000);
    console.log("bananana");
    return "getBanana";
  }

  // console.log(JSON.stringify(store[0]));
  return (
    <View>
      <Text>===============================</Text>
      <Text>
        {JSON.stringify(store)}
      </Text>
      <Button title='비동기 버튼' onPress={async () => {
        AsyncStorage.getAllKeys(async (err, result) => {
          if (!err) setStore(result);
        });

      }}></Button>
      <Button title='추가' onPress={async () => {
        // AsyncStorage.setItem("10", "1");
        // AsyncStorage.getAllKeys( (err, result) => {
        //   if (!err) setStore(result);
        // });
        // await getBanana();
        // AsyncStorage.setItem("11", "1");
        // AsyncStorage.getAllKeys( (err, result) => {
        //   if (!err) setStore(result);
        // });
        // await getBanana();

        AsyncStorage.clear()
        // AsyncStorage.getAllKeys( (err, result) => {
        //   if (!err) setStore(result);
        // });

      }}></Button>



      <Button title='리로딩' onPress={
        async () => {
          const dsf = await AsyncStorage.removeItem("{\"time\":\"20230112173013\",\"title\":\"ㅇㄹㄴㅇㅎㄴㅁㅎ\\n\",\"content\":[\"ㅈ퓯\",\"\\n\\n\\n\",\"듐듀\"],\"whenAlarm\":3,\"endTime\":\"20230112173016\"}");

        }
      } />
    </View>
  );
};