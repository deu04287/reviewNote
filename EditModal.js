import { ScrollView, TouchableOpacity, Button, Modal, StyleSheet, Text, View, StatusBar, Pressable } from 'react-native';
import { Dimensions } from 'react-native'; //나중에 전역변수로 바꾸기
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getTime from './functions/getTime';
import { Switch } from 'react-native';
import * as Notifications from 'expo-notifications';
import { RadioButton } from 'react-native-paper'; // radio button
import getEndTime from './functions/getEndTime';

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
        if(whenAlarm === 0 )
            setIsOn(false);
        else
            setIsOn(true);
    }, []);
    return (
        <Switch
            value={isOn}
            onValueChange={() => {
                if(isOn === true){
                    setTmpSaveWhenAlarm(whenAlarm);
                    setWhenAlarm(0);
                  // // // //  Notifications.cancelScheduledNotificationAsync(props.iden);
                }
                else{
                  setWhenAlarm(tmpSaveWhenAlarm);
                }
                setIsOn(!isOn);

            }}
        />
    );
}

  const AlarmSettingModal = (props) =>{
    const [tmpwhenAlarm, setTmpwhenAlarm] = useState(props.whenAlarm);

    function SettingAlarm(props) {
        return (
            <View>
                <RadioButton.Group onValueChange={value => setTmpwhenAlarm(Number(value))} value={tmpwhenAlarm}>
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
    
  
    return(
        <Modal
                animationType="none"
                transparent={true}
                visible={showmodal}
                onRequestClose={()=>{setShowmodal(false)}}
            >
                <View style={[
        StyleSheet.absoluteFill,
        { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
      ]}>
                    <View style={{ width: '95%', height: '95%', position: 'absolute', top: '2.5%', left: '2.5%', backgroundColor: 'white', borderRadius: 10 }}>
                        <Text>sfasdff</Text>
                        <SettingAlarm></SettingAlarm>
                        <Button title='submit' onPress={async()=>{
                          try {
                            await setWhenAlarm(tmpwhenAlarm);
                            // console.log(whenAlarm);
                         } catch(error) {
                            console.log("error");
                         }
                         setShowmodal(false);
                          }}/>
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
    if(getTime() >= route.params.endTime){
      setWhenAlarm(0);
    }
    
}, []);
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.3)' },]}>
      <View style={{ width: '95%', height: '95%', position: 'absolute', top: '2.5%', left: '2.5%', backgroundColor: 'white', borderRadius: 10 }}>
        <Text style={{ textAlign: 'center' }}>edit modal</Text>
        <Text>
          {content.map((word, idx) => (
            <Pressable key={idx + 10} onPress={() => onPressWord(word)}>
              <Text style={{ fontWeight: boldList.includes(word) ? 'bold' : 'normal' }}>
                {word}
              </Text>
            </Pressable>
          ))}
        </Text>
        <AlarmSettingModal whenAlarm={whenAlarm}/>
        <Button title={JSON.stringify(whenAlarm)} onPress={() => {
          // if (!(title === route.params.title && JSON.stringify(content) === JSON.stringify(route.params.content) && JSON.stringify(whenAlarm) === JSON.stringify(route.params.whenAlarm) && JSON.stringify(tmpBoldList) === JSON.stringify(boldList))) {
            Notifications.cancelScheduledNotificationAsync(route.params.time);
            AsyncStorage.removeItem(JSON.stringify({ time: route.params.time, title: route.params.title, content: route.params.content, whenAlarm: route.params.whenAlarm, endTime:route.params.endTime }));
            AsyncStorage.setItem(JSON.stringify({ time: getTime(), title: title, content: content, whenAlarm: whenAlarm, endTime:getEndTime(getTime(),whenAlarm)}), JSON.stringify({ boldList: boldList }));
            Notifications.scheduleNotificationAsync({
              content: {
                title: title,
                body: 'Change sides!',
              },
              identifier: getTime(),
              trigger: {
                seconds: whenAlarm, //onPress가 클릭이 되면 60초 뒤에 알람이 발생합니다.
              },
            });            

          // }
          navigation.navigate('Home');
        }}/>
            <View style={{alignItems:'center'}}>
              <TouchableOpacity 
                      style={{backgroundColor:'#DDD', width:300, height:100, borderRadius:10, justifyContent:'center', alignItems:'center'}}
                      onPress={() => setShowmodal(true)}>
                      <Text>go AlarmModal</Text>
                      <ARR />
                    </TouchableOpacity>
            </View>
        <Button title='go back' onPress={ () => navigation.goBack() }/>
      </View>
    </View>
  );
}
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

