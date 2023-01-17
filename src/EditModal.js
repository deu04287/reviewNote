import { ScrollView, TouchableOpacity, Button, Modal, StyleSheet, Text, View, StatusBar, Pressable } from 'react-native';
import { Dimensions } from 'react-native'; //나중에 전역변수로 바꾸기
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getTime from '../functions/getTime';
import { Switch } from 'react-native';
import * as Notifications from 'expo-notifications';
import { RadioButton } from 'react-native-paper'; // radio button
import getEndTime from '../functions/getEndTime';

export default function EditModal({ navigation, route }) {
  const [title, setTitle] = useState(route.params.retitle);
  const [content, setContent] = useState(JSON.parse(route.params.recontent));
  const [boldList, setBoldList] = useState(route.params.boldList);
  const [whenAlarm, setWhenAlarm] = useState(route.params.whenAlarm);

  const [parseContent, setParseContent] = useState(JSON.parse(route.params.recontent).join(''));
  const [tmpBoldList, setTmpBoldList] = useState(route.params.tmpBoldList);


  const [showmodal, setShowmodal] = useState(false);
  const [tmpSaveWhenAlarm, setTmpSaveWhenAlarm] = useState(0);

  const ARR = () => {
    const [isOn, setIsOn] = useState(false);
    useEffect(() => {
      if (whenAlarm === 0)
        setIsOn(false);
      else
        setIsOn(true);
    }, []);
    return (
      <Switch
        value={isOn}
        onValueChange={() => {
          if (isOn === true) {
            setTmpSaveWhenAlarm(whenAlarm);
            setWhenAlarm(0);
            // // // //  Notifications.cancelScheduledNotificationAsync(props.iden);
          }
          else {
            setWhenAlarm(tmpSaveWhenAlarm);
          }
          setIsOn(!isOn);

        }}
      />
    );
  }

  const AlarmSettingModal = (props) => {
    const [tmpwhenAlarm, setTmpwhenAlarm] = useState(props.whenAlarm);

    function SettingAlarm(props) {
      return (
        <View>
          <RadioButton.Group onValueChange={value => setTmpwhenAlarm(Number(value))} value={tmpwhenAlarm}>
            <RadioButton.Item label="사용 안함" value={0} />
            <RadioButton.Item label="3" value={3} />
          
            <RadioButton.Item label="1시간 후" value={3600} />
            <RadioButton.Item label="1일 후" value={86400} />
            <RadioButton.Item label="1주일 후" value={604800} />
            <RadioButton.Item label="30일 후" value={2592000} />
          </RadioButton.Group>
        </View>
      );
    }


    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={showmodal}
        onRequestClose={() => { setShowmodal(false) }}
      >
<View style={[
      StyleSheet.absoluteFill,
      { backgroundColor: 'rgba(0, 0, 0)' },
    ]}>
      <Pressable style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }} onPress={() => { navigation.goBack(); }}></Pressable>
      <View style={{ width: '100%', height: '85%', position: 'absolute', top: '15%', backgroundColor: 'white', borderTopStartRadius: 10, borderTopEndRadius: 10 }}>
            <SettingAlarm></SettingAlarm>
            
            <TouchableOpacity 
            onPress={async () => {
              try {
                await setWhenAlarm(tmpwhenAlarm);
                // console.log(whenAlarm);
              } catch (error) {
                console.log("error");
              }
              setShowmodal(false);
            }}
            style={{position:'absolute',bottom:0,zIndex:1, backgroundColor: '#525252', width: Dimensions.get('window').width, height: 50, justifyContent: 'center' }}>
              <Text style={{ textAlign: 'center', color: 'white' }}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  const onPressWord = (word) => {
    if (boldList.includes(word)) setBoldList(boldList.filter((w) => w !== word));
    else setBoldList([...boldList, word]);
  };

  useEffect(() => {
    if (getTime() >= route.params.endTime) {
      setWhenAlarm(0);
    }
    let a = [];
    boldList.find(element => {
      if (content.includes(element) == true) {
        a.push(element);
        setBoldList(a);
      }
    });

  }, []);


  return (
    <View style={[
      StyleSheet.absoluteFill,
      { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
    ]}>
      <Pressable style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }} onPress={() => { navigation.goBack(); }}></Pressable>
      <View style={{ width: '100%', height: '85%', position: 'absolute', top: '15%', backgroundColor: 'white', borderTopStartRadius: 10, borderTopEndRadius: 10 }}>
        <View>
          <TouchableOpacity
            style={{ position:'absolute',right:10,zIndex:1,backgroundColor: '#EEE', width: 50, height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => setShowmodal(true)}>
            <Text>🕒</Text>

          </TouchableOpacity>
          <TouchableOpacity 
                        style={{ position:'absolute',right:62,zIndex:1, backgroundColor: '#EEE', width: 50, height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
          title={JSON.stringify(whenAlarm)} 
          onPress={() => {
            // if (!(title === route.params.title && JSON.stringify(content) === JSON.stringify(route.params.content) && JSON.stringify(whenAlarm) === JSON.stringify(route.params.whenAlarm) && JSON.stringify(tmpBoldList) === JSON.stringify(boldList))) {
            Notifications.cancelScheduledNotificationAsync(route.params.time);
            AsyncStorage.removeItem(JSON.stringify({ time: route.params.time, title: route.params.title, content: route.params.content, whenAlarm: route.params.whenAlarm, endTime: route.params.endTime }));
            AsyncStorage.setItem(JSON.stringify({ time: getTime(), title: title, content: content, whenAlarm: whenAlarm, endTime: getEndTime(getTime(), whenAlarm) }), JSON.stringify({ boldList: boldList.filter((w) => w = w.trim()) }));
            Notifications.scheduleNotificationAsync({
              content: {
                title: title,
                body: 'Change sides!',
                sticky: true,
                data: { strData: JSON.stringify({ time: getTime(), title: title, content: content, whenAlarm: whenAlarm, endTime: getEndTime(getTime(), whenAlarm) }), strBoldList: JSON.stringify({ boldList: boldList.filter((w) => w = w.trim()) }) }
              },
              identifier: getTime(),
              trigger: {
                seconds: whenAlarm, 
              },
            });
  
            // }
            navigation.navigate('Home');
          }}><Text>✔</Text></TouchableOpacity>
        </View>
        <ScrollView overScrollMode="never" contentContainerStyle={{ marginTop:50,paddingTop: 15, paddingRight: 15, paddingLeft: 15 }}>

        <Text>
          {content.map((word, idx) => {
            if(word.match(/\n+/g)){
              return (
                <Text key={idx + 10}>
                {word}
                </Text>
              );
            }
            else{
              return (
                <Pressable key={idx + 10} onPress={() => onPressWord(word)}>
                  <Text style={{ fontSize: 17, fontWeight: boldList.includes(word) ? "900" : 'normal' }}>
                    {word}
                  </Text>
                </Pressable>
              );
            }
            
          }
          )}
        </Text>
        </ScrollView>
        <AlarmSettingModal whenAlarm={whenAlarm} />
              </View>
    </View>
  );
}
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

