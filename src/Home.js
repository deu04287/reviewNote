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
            if (!err) {
                // console.log("1.알림 보내는거부터 똑바로하기 + 알림의 내용을 title로하기 + 알림 페이지 따로만들기 + 알람취소");
                // console.log("2. writepage 똑바로하기");
                // console.log("3. 구글에 업로드하기(업데이트로 하는법도 알아야함)");
                // console.log("4. 백그라운드, 권한설정은 디자인까지 다 끝내고 하기");
                // console.log("5. 지울때 삭제하시겠읍니까? 뒤로갈때 저장안됨니당");
                // console.log("6. 에러 처리");
                setStore(result.reverse());
            }
        });
    }, []);
    useEffect(() => {
        navigation.addListener('focus', () => {
            // console.log("navigation useEffect");
            AsyncStorage.getAllKeys((err, result) => {
                if (!err) {
                    setStore(result.reverse());
                }
            });
        });
    }, [navigation]);
    useEffect(() => {
        AsyncStorage.getAllKeys((err, result) => {
            if (!err) {
                setStore(result.reverse());
            }
        });
    }, [visibleModal]);
    
    const EachSwitch = (props) => {
        const [isOn, setIsOn] = useState(false);
        const [innerSecond, setInnerSecond] = useState(props.number["whenAlarm"]);
        

        const [turnOFFAfterTime, setTurnOFFAfterTime] = useState(getEndTime(props.number['time'],Number(props.number["whenAlarm"])));
        
        useEffect(() => {
            if(props.onOff === 0 )
            setIsOn(false);
            else{
                if(currentTime2 >= turnOFFAfterTime){
                    setIsOn(false);
                    setInnerSecond(0);
                }
                else{
                    setIsOn(true);
                }
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
                    <View>
                        <Text>
                        {JSON.stringify(currentTime) }                        
                        </Text>
                        <Button title='예약 전체 삭제' onPress={()=>{
                            // Notifications.cancelScheduledNotificationAsync("123456789");
                        Notifications.cancelAllScheduledNotificationsAsync();
    
                    }}></Button>
                    <Button title='전체 예약 가져오기' onPress={async ()=>{
                        const a = await Notifications.getAllScheduledNotificationsAsync();
                        console.log(a);
                    }}></Button>
                    </View>
            <ScrollView>
                {store.map((number, idx) =>
                    <View key={idx + 10} style={styles.titlelist}>
                        <View>
                            <Pressable
                                onPress={() => {
                                    navigation.navigate('EditPage', { time: JSON.parse(number)["time"], title: JSON.parse(number)["title"], content: JSON.parse(number)["content"], whenAlarm: JSON.parse(number)["whenAlarm"], endTime:JSON.parse(number)["endTime"], bold: number });
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
                                ]}
                            >
                                <View >
                                    <Text>
                                        <Text>• </Text>
                                        <Text style={styles.titlelistfont} key={idx} >{JSON.parse(number)["title"]}</Text>
                                        <Text>/////남은 시간{JSON.parse(number)["whenAlarm"]}</Text>
                                        <Text>/////끝나는시간{JSON.parse(number)["endTime"]}</Text>
                                    </Text>
                                </View>

                                <EachSwitch onOff={JSON.parse(number)["whenAlarm"]} identifier={JSON.parse(number)["time"]} number={JSON.parse(number)}/>
                            </Pressable>
                        </View >

                    </View>
                )}
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visibleModal}
            >
                <View >
                    <View >
                        <Pressable
                            style={styles.container}
                            onPress={() => {
                                AsyncStorage.removeItem(JSON.parse(tmpArticle));
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
                            <Text>editt</Text>
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
