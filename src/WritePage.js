// import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, Modal, Pressable, Button, KeyboardAvoidingView,StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Dimensions } from 'react-native';//나중에 전역변수로 바꾸기

import AsyncStorage from '@react-native-async-storage/async-storage';

import getTime from '../functions/getTime';

import * as Notifications from 'expo-notifications';

import { RadioButton } from 'react-native-paper'; // radio button

import { Switch } from 'react-native';
import TimeSettingPage from '../notUsed/TimeSettingPage';
import WriteModal from './WriteModal';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


function showAlert(title, content) {
  Alert.alert(
    title,
    content,
    [
      {
        text: 'OK',
        onPress: () => console.log('OK button pressed'),
      },
    ],
    { cancelable: false }
  );
}

export default function WritePage({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [boldList, setBoldList] = useState([]);
  const [whenAlarm, setWhenAlarm] = useState(0);

  const ref_content = useRef();


  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        // e.preventDefault();

        console.log("DSFsdf");
      }),
    [navigation]
  );
  
  return (
    <View style={styles.viewMain}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <View style={styles.viewTitle}>
        <TextInput 
        style={{fontSize:17,}}
        placeholderTextColor="#0005"
        autoFocus={true} onBlur={() =>  ref_content.current.focus() } maxLength={42} placeholder='제목' value={title} onChange={(e) => {
          e.preventDefault();
          const { eventCount, target, text } = e.nativeEvent;
          setTitle(text);
        }} />
      </View>

      

        <View style={styles.viewContent}>
        <ScrollView >
          <TextInput ref={ref_content} 
                  placeholderTextColor="#0005"
            multiline value={content} placeholder='내용' onChange={(e) => {
              e.preventDefault();
              const { eventCount, target, text } = e.nativeEvent;
              setContent(text);
            }} />
      </ScrollView>
      </View>
      <TouchableOpacity style={{ backgroundColor: '#525252', width: Dimensions.get('window').width,height:50, justifyContent:'center', alignContent: 'center', }}
          onPress={() => {
            if (title === '') {
              console.log("title empty");
              showAlert('', '제목이 비어있습니다');
            }
            else if (content === '') {
              console.log("content empty");
              showAlert('', '내용이 비어있습니다');
            }
            else {

              navigation.navigate('WriteModal', {time: getTime(), title: title, content: JSON.stringify(content.split(/(\s+)/)),whenAlarm : whenAlarm , boldList:boldList });
              
            }
          }}><Text style={{ textAlign: 'center', color:'white' }}>저장</Text></TouchableOpacity>
    </View>
  );

}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  viewMain:{
    flex:1,
    justifyContent:'center',
    textAlign:'center',
    alignItems:'center',
    position:'relative',
  },
  viewTitle:{
    // flex:1,

    justifyContent:'center',
    backgroundColor:'white',
    width:SCREEN_WIDTH,
    borderBottomColor: '#EEE', borderBottomWidth: 0.7,    
    height: 50,
    paddingLeft:10,paddingRight:10,
  },
  viewContent:{
        flex:1,
    backgroundColor: 'white',
    width: SCREEN_WIDTH,
    // height: SCREEN_HEIGHT/100*100,
    textAlignVertical: 'top',
    paddingLeft:10, paddingTop:10, paddingRight:10,
  },
  buttonSave:{

  },
  // modal: {
  //   backgroundColor: '#DDD',
  //   width: SCREEN_WIDTH/1.1,
  //   height: SCREEN_HEIGHT/1.1,
  // },
  // titlelist: {
  //   backgroundColor: '#555',
  //   width: 400,
  //   height: 30,
  // },
  // contentStyle: {

  // },
});
