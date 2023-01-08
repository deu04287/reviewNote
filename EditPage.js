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


export default function EditPage({ navigation, route }) {
    const [title, setTitle] = useState(route.params.title);
    const [content, setContent] = useState(route.params.content);

    const [endTime, setEndTime] = useState(route.params.endTime);

    const [boldList, setBoldList] = useState([]);
    const [tmpBoldList, setTmpBoldList] = useState([]);

    const [parseContent, setParseContent] = useState(route.params.content.join(''));

    const [showModal, setShowModal] = useState(false);

    const [toggle_text_or_textinput, setToggle_text_or_textinput] = useState(true);


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
            style={styles.qwer}
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

    const onPressWord = (word) => {
        if (boldList.includes(word)) {
            setBoldList(boldList.filter((w) => w !== word));
        } else {
            setBoldList([...boldList, word]);
        }
    };

    const [whenAlarm, setWhenAlarm] = useState(0);
    

    useEffect(() => {
        AsyncStorage.getItem(route.params.bold, (err, result) => {
            if (!err) {
                setBoldList(JSON.parse(result).boldList);
                // console.log(result);
                setTmpBoldList(JSON.parse(result).boldList);
            }
            else console.log("error");
        });
        setWhenAlarm(route.params.whenAlarm);
        
    }, []);

    return (
        <View >
            <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
            <View style={{ backgroundColor: 'white' }}>
                <Text>제목</Text>
                <TextInput value={title} onChange={(e) => {
                    e.preventDefault();
                    const { eventCount, target, text } = e.nativeEvent;
                    setTitle(text);
                }} />
                <Text>내용</Text>
                <Pressable onPress={() => { setToggle_text_or_textinput(!toggle_text_or_textinput); console.log(boldList) }}>
                    {toggle_text_or_textinput ?
                        <Text>
                            {content.map((word, idx) => (
                                <Text key={idx} style={{ fontWeight: boldList.includes(word) ? 'bold' : 'normal' }}>
                                    {word}
                                </Text>
                            ))}
                        </Text>
                        :
                        <TextInput multiline value={parseContent} onBlur={(e) => {
                            e.preventDefault();
                            setContent(parseContent.split(/(\s+)/));
                            setToggle_text_or_textinput(!toggle_text_or_textinput);

                        }} onChange={(e) => {
                            e.preventDefault();
                            const { eventCount, target, text } = e.nativeEvent;
                            setParseContent(text);
                        }} />}
                </Pressable>
                <Button title='저장★' onPress={() => {
                    navigation.navigate('EditModal', { time: route.params.time, retitle: title, title:route.params.title,content:route.params.content, recontent: JSON.stringify(parseContent.split(/(\s+)/)),whenAlarm : whenAlarm ,endTime:endTime, boldList:boldList ,tmpBoldList:tmpBoldList});
                }}></Button>
            </View>
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
