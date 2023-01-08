import { ScrollView, TouchableOpacity, Button, Modal, StyleSheet, Text, View, StatusBar, Pressable } from 'react-native';
import { Dimensions } from 'react-native'; //나중에 전역변수로 바꾸기
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getTime from '../functions/getTime';
import { Switch } from 'react-native';
import * as Notifications from 'expo-notifications';

import getEndTime from '../functions/getEndTime';
import create from 'zustand'

const useBearStore = create((set) => ({
    currentTime: getTime(),
}))


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

Notifications.getPresentedNotificationsAsync
export default function Home({ navigation }) {
    const [store, setStore] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [tmpArticle, setTmpArticle] = useState();
    const [currentTime2, setCurrentTime2] = useState(getTime());

    useEffect(() => {
        // AsyncStorage.clear();
        // setCurrentTime2(getTime());
        AsyncStorage.getAllKeys((err, result) => {
            if (!err) setStore(result.reverse());
        });
    }, []);
    useEffect(() => {
        navigation.addListener('focus', () => {
            // console.log("navigation useEffect");
            AsyncStorage.getAllKeys((err, result) => {
                if (!err) setStore(result.reverse());
            });
        });
    }, [navigation]);
    useEffect(() => {

        // console.log("visiblemodal useEffect");
        AsyncStorage.getAllKeys((err, result) => {
            if (!err) setStore(result.reverse());
        });
    }, [visibleModal]);

    const EachSwitch = (props) => {
        const [isOn, setIsOn] = useState(false);
        const [innerSecond, setInnerSecond] = useState(props.number["whenAlarm"]);
        const [turnOFFAfterTime, setTurnOFFAfterTime] = useState(getEndTime(props.number['time'], Number(props.number["whenAlarm"])));

        useEffect(() => {
            if (props.onOff === 0)
                setIsOn(false);
            else {
                if (currentTime2 >= turnOFFAfterTime) {
                    setIsOn(false);
                    setInnerSecond(0);
                }
                else setIsOn(true);
            }
            }, []);

            
            return (
                <View>
                <Text>{JSON.stringify(props.number["time"])}</Text>
            <Switch
                value={isOn}
                onValueChange={() => {
                    if(innerSecond !== 0){
                        setIsOn(!isOn);
                        if(isOn === true){
                            Notifications.cancelScheduledNotificationAsync(props.identifier);   
                        }
                        else{
                            Notifications.scheduleNotificationAsync({
                                content: {
                                    title: props.number["title"],
                                    body: 'Change sides!',
                                },
                                identifier: props.number["time"],
                                trigger: {
                                    seconds: innerSecond, //onPress가 클릭이 되면 60초 뒤에 알람이 발생합니다.
                                },
                            });
                        }
                    }
                }}
                />
            </View>
        );
    }

    const currentTime = useBearStore((state) => state.currentTime);
    return (
        <View style={styles.main}>
            <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
            <View style={{ marginTop: 4, marginBottom: 4 }}>

                <TouchableOpacity style={styles.addButton}
                    onPress={() => {
                        navigation.navigate('WritePage');
                    }}><Text style={styles.addText}>+</Text></TouchableOpacity>
            </View>
            <ScrollView>
                {store.map((number, idx) =>
                <Pressable
                key={idx + 10}
                onPress={() => {
                    navigation.navigate('EditPage', { time: JSON.parse(number)["time"], title: JSON.parse(number)["title"], content: JSON.parse(number)["content"], whenAlarm: JSON.parse(number)["whenAlarm"], endTime: JSON.parse(number)["endTime"], bold: number });
                }}
                onLongPress={() => {
                    setTmpArticle(JSON.stringify(number));
                    setVisibleModal(!visibleModal);
                }}
                style={({ pressed }) => [
                    {
                        backgroundColor: pressed
                            ? 'rgb(210, 230, 255)'
                            : 'white'
                    }
                ]}>
                    <View  style={styles.titlelist}>
                        <View >
                            
                                <View style={{width:Dimensions.get('window').width/100*70, height:Dimensions.get('window').height/100*5.5, position:'absolute', left:0, top:-21, backgroundColor:'white'}}>
                                    <Text >
                                        <Text>• </Text>
                                        <Text style={styles.titlelistfont} key={idx} >{JSON.parse(number)["title"]}</Text>
                                    </Text>
                                </View>
                                <EachSwitch onOff={JSON.parse(number)["whenAlarm"]} identifier={JSON.parse(number)["time"]} number={JSON.parse(number)} />
                        </View >
                    </View>
                            </Pressable>
                )}
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visibleModal}
            >
                <View>
                    <View>
                        <Pressable
                            style={styles.container}
                            onPress={() => {
                                
                                AsyncStorage.removeItem(JSON.parse(tmpArticle));
                                Notifications.cancelScheduledNotificationAsync(JSON.parse(JSON.parse(tmpArticle))["time"]);
                                setVisibleModal(!visibleModal);
                            }}
                        >
                            <Text>delete</Text>
                        </Pressable>
                        <Pressable
                            style={styles.container}
                            onPress={() => {
                                setVisibleModal(!visibleModal);
                            }}
                        >
                            <Text>edit</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "white",
    },
    container: {
        marginTop: 150,
        backgroundColor: '#888',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titlelist: {
        backgroundColor: 'white',
        width: SCREEN_WIDTH / 1.08,
        height: SCREEN_HEIGHT / 9,
        borderRadius: 3,
        // height: 42,
        margin: 10,
        marginTop: 3,
        marginBottom: 3,
        elevation: 5,
        justifyContent: 'center',
        textAlign: 'center',
        paddingLeft: 10,
    },
    titlelistfont: {
        fontSize: 15,
    },
    eachSwitchPosition: {
        left: SCREEN_WIDTH/100*78,
        backgroundColor:"white",
         width:40,
         height:30,
          transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }]
    },
    addButton: {
        left: SCREEN_WIDTH / 1.18,
        zIndex: 1,
        borderRadius: 30,
        backgroundColor: 'white',
        width: SCREEN_WIDTH / 8,
        elevation: 8,
        alignItems: 'center'
    },
    addText: {
        fontSize: 30,
    },
});
