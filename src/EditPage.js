// import { StatusBar } from 'expo-status-bar';
import { Button, Modal, StyleSheet, Text,Alert,BackHandler, View, ScrollView,Keyboard, Pressable, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Dimensions } from 'react-native'; //나중에 전역변수로 바꾸기

import { RadioButton } from 'react-native-paper'; // radio button

import AsyncStorage from '@react-native-async-storage/async-storage';

import getTime from '../functions/getTime';

import * as Notifications from 'expo-notifications';

import { Switch } from 'react-native';


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

export default function EditPage({ navigation, route }) {
    const [title, setTitle] = useState(route.params.title);
    const [content, setContent] = useState(route.params.content);
    const [endTime, setEndTime] = useState(route.params.endTime);
    const [boldList, setBoldList] = useState([]);
    const [tmpBoldList, setTmpBoldList] = useState([]);
    const [parseContent, setParseContent] = useState(route.params.content.join(''));
    const [toggle_text_or_textinput, setToggle_text_or_textinput] = useState(undefined);
    const [toggle_text_or_textinput2, setToggle_text_or_textinput2] = useState(0);

    const [whenAlarm, setWhenAlarm] = useState(0);


    const ref_content = useRef();

    // useEffect(
    //     () =>
    //       navigation.addListener('beforeRemove', (e) => {
    //         e.preventDefault();
    //         Alert.alert("되돌아가시겠습니까?", "변경사항이 저장되지 않습니다", [
    //             {
    //               text: "취소",
    //               onPress: () => null,
    //               style: "cancel"
    //             }
    //             ,{ text: "확인", onPress: () => navigation.goBack() }
    //           ]);
    //         // console.log("아마 뒤로이동할때 뜨는거");
    //         // 토글 1이 defined 면 뒤로가기 okay@!!!!!!!!!!!!!!
    //       }),
    //     [navigation]
    //   );

      const backAction = () => {
        if(parseContent === route.params.content.join('')){
            navigation.goBack();
        } else{
            Alert.alert("되돌아가시겠습니까?", "변경사항이 저장되지 않습니다", [
                {
                  text: "취소",
                  onPress: () => null,
                  style: "cancel"
                }
                ,{ text: "확인", onPress: () => navigation.goBack() }
              ]);
        }
        return true;
      };
    
      useEffect(() => {
        
        BackHandler.addEventListener("hardwareBackPress", backAction);


    
        return () =>
          BackHandler.removeEventListener("hardwareBackPress", backAction);
      }, [parseContent]);
    useEffect(() => {
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            
            if(toggle_text_or_textinput === undefined && toggle_text_or_textinput2 === 0){
                setToggle_text_or_textinput2(0); 
                setToggle_text_or_textinput(undefined);
            }
          });

        AsyncStorage.getItem(route.params.bold, (err, result) => {
            if (!err) {
                setBoldList(JSON.parse(result).boldList);
                setTmpBoldList(JSON.parse(result).boldList);
            }
            else console.log("error");
        });
        setWhenAlarm(route.params.whenAlarm);

    }, []);

    return (
        <View style={styles.viewMain}>
            <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
            <View style={styles.viewTitle}>
                <TextInput
                    style={{ fontSize: 20, }}
                    placeholderTextColor="#0005"
                    maxLength={42} placeholder='제목' value={title} onChange={(e) => {
                        e.preventDefault();
                        const { eventCount, target, text } = e.nativeEvent;
                        setTitle(text);
                    }} />
            </View>
            <View style={styles.viewContent}>
                
            <Pressable onPress ={() => { 
                Keyboard.dismiss();
                setToggle_text_or_textinput(0); 
                setToggle_text_or_textinput2(undefined);
                // ref_content
                        
                    }}>
            <View style={{height:toggle_text_or_textinput}}>
                <ScrollView overScrollMode="never">

                            <Text >
                                {content.map((word, idx) => (
                                    <Text key={idx} style={{ fontSize:17,fontWeight: boldList.includes(word) ? "900" : 'normal' }}>
                                        {word}
                                    </Text>
                                ))}
                            </Text>
                </ScrollView>
                </View>
                    </Pressable>
                
                <View style={{ width:toggle_text_or_textinput2}}>
                <ScrollView overScrollMode="never">

                            <TextInput
                                style={{fontSize:17,}}
                                ref={ref_content}
                                placeholderTextColor="#0005" 
                                placeholder='내용' 
                                multiline 
                                value={parseContent} 
                                onBlur={(e) => {
                                    e.preventDefault();
                                    setContent(parseContent.split(/(\s+)/));
                                    setToggle_text_or_textinput2(0);
                                    setToggle_text_or_textinput(undefined);
                                }} onChange={(e) => {
                                    e.preventDefault();
                                    const { eventCount, target, text } = e.nativeEvent;
                                    setParseContent(text);
                                }} />
                </ScrollView>
                </View>
                
            </View>
            
            <TouchableOpacity style={{ backgroundColor: '#525252', width: Dimensions.get('window').width, height: 50, justifyContent: 'center', alignContent: 'center', }}
                onPress={() => {
                    if (title === '') {
                        showAlert('', '제목이 비어있습니다');
                    }
                    else if (content === '') {
                        showAlert('', '내용이 비어있습니다');
                    }
                    else {
                        Keyboard.dismiss();
                        navigation.navigate('EditModal', { time: route.params.time, retitle: title, title: route.params.title, content: route.params.content, recontent: JSON.stringify(parseContent.split(/(\s+)/)), whenAlarm: whenAlarm, endTime: endTime, boldList: boldList, tmpBoldList: tmpBoldList });
                    }
                }}><Text style={{ textAlign: 'center', color: 'white' }}>핵심단어 & 복습알람 설정</Text></TouchableOpacity>
        </View>
        // <Pressable onPress={() => { setToggle_text_or_textinput(!toggle_text_or_textinput);  }}>
        //     {toggle_text_or_textinput ?
        //         <Text>
        //             {content.map((word, idx) => (
        //                 <Text key={idx} style={{ fontWeight: boldList.includes(word) ? 'bold' : 'normal' }}>
        //                     {word}
        //                 </Text>
        //             ))}
        //         </Text>
        //         :
        //         <TextInput multiline value={parseContent} onBlur={(e) => {
        //             e.preventDefault();
        //             setContent(parseContent.split(/(\s+)/));
        //             setToggle_text_or_textinput(!toggle_text_or_textinput);

        //         }} onChange={(e) => {
        //             e.preventDefault();
        //             const { eventCount, target, text } = e.nativeEvent;
        //             setParseContent(text);
        //         }} />}
        // </Pressable>
        // <Button title='저장★' onPress={() => {
        // navigation.navigate('EditModal', { time: route.params.time, retitle: title, title:route.params.title,content:route.params.content, recontent: JSON.stringify(parseContent.split(/(\s+)/)),whenAlarm : whenAlarm ,endTime:endTime, boldList:boldList ,tmpBoldList:tmpBoldList});
        // }}></Button>

    );
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    viewMain: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    viewTitle: {
        // flex:1,

        justifyContent: 'center',
        backgroundColor: 'white',
        width: SCREEN_WIDTH,
        borderBottomColor: '#EEE', borderBottomWidth: 0.7,
        height: 55,
        paddingLeft: 15, paddingRight: 10,
    },
    viewContent: {
        flex: 1,
        backgroundColor: 'white',
        width: SCREEN_WIDTH,
        // height: SCREEN_HEIGHT/100*100,
        textAlignVertical: 'top',
        paddingLeft: 15, paddingTop: 15, paddingRight: 10,
    },
    buttonSave: {

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
