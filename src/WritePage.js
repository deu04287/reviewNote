// import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, Modal, Pressable, Button, StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
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
  const [visibleModal, setVisibleModal] = useState(false);
  const [boldList, setBoldList] = useState([]);

  const [whenAlarm, setWhenAlarm] = useState(0);
  function SettingAlarm(props) {
      return (
          <View>
              <RadioButton.Group onValueChange={value => {
                  setWhenAlarm(Number(value));

              }} value={whenAlarm}>
                  <RadioButton.Item label="사용 안함" value={0} />
                  <RadioButton.Item label="3초" value={3} />
                  <RadioButton.Item label="1분" value={60} />
                  <RadioButton.Item label="1시간 후" value={3600} />
                  <RadioButton.Item label="1일 후" value={86400} />
                  <RadioButton.Item label="1주일 후" value={604800} />
                  <RadioButton.Item label="30일 후" value={2592000} />
              </RadioButton.Group>
          </View>
      );
  }

  const ARR = (props) => {
    const [isOn, setIsOn] = useState(false);
    useEffect(() => {
        // if(props.onOff === 0 )
        //     setIsOn(false);
        // else
        //     setIsOn(true);
    }, []);
        
    return (
        <Switch
            value={isOn}
            onValueChange={() => {
                setIsOn(!isOn);
                if(isOn === true){
                    // Notifications.cancelScheduledNotificationAsync(props.iden);
                    // console.log(props.iden);
                }
                else{
                    // console.log(props.onOff);
                }
            }}
        />
    );
}
  // async function restoreAlarm(title,content,when){

  // }
    
  const onPressWord = (word) => {
    if (boldList.includes(word)) {
      setBoldList(boldList.filter((w) => w !== word));
    } else {
      setBoldList([...boldList, word]);
    }
  };

  return (
    <View >
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <View style={{ borderBottomColor: '#DDD', borderBottomWidth: 2.5,    height: SCREEN_HEIGHT/100*8, }}>
        <TextInput style={{ height: 45 }} placeholder='제목' value={title} onChange={(e) => {
          e.preventDefault();
          const { eventCount, target, text } = e.nativeEvent;
          setTitle(text);
        }} />

        <TouchableOpacity style={{ backgroundColor: '#DDD', position: 'absolute', right: 10, width: 60, height: 30, alignContent: 'center', justifyContent: 'center', }}
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
          }}><Text style={{ textAlign: 'center' }}>저장</Text></TouchableOpacity>

      </View>
      <View >
        <ScrollView >
          <TextInput style={styles.contentStyle}
            multiline value={content} onChange={(e) => {
              e.preventDefault();
              const { eventCount, target, text } = e.nativeEvent;
              setContent(text);
            }} />
        </ScrollView>
      </View>
      
    </View>
  );

}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#DDD',
    width: SCREEN_WIDTH/1.1,
    height: SCREEN_HEIGHT/1.1,
  },
  titlelist: {
    backgroundColor: '#555',
    width: 400,
    height: 30,
  },
  contentStyle: {
    backgroundColor: 'white',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT/100*89.3,
    textAlignVertical: 'top',
    borderBottomWidth: 10, borderBottomColor: '#AAA' 
  },
});
