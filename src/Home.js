import { ScrollView, TouchableOpacity,RefreshControl, Button, Modal, StyleSheet, Text, View, StatusBar, Pressable } from 'react-native';
import { Dimensions } from 'react-native'; //나중에 전역변수로 바꾸기
import React, { useState, useEffect,useCallback } from 'react';
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


export default function Home({ navigation }) {
    const [store, setStore] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [tmpArticle, setTmpArticle] = useState();
    const [currentTime2, setCurrentTime2] = useState(getTime());

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = useCallback(() => {
      setCurrentTime2(getTime());
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }, []);

    const [notificationPermissionToken, setNotificationPermissionToken] = useState('');

    async function registerForPushNotificationsAsync() {
        let token;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        token = finalStatus;
        console.log(token);
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
        return token;
    }

    useEffect(() => {
        // Notifications.requestPermissionsAsync();
        setNotificationPermissionToken(registerForPushNotificationsAsync()); 
        
        Notifications.addNotificationResponseReceivedListener(response => {
            // console.log(response.notification.request.content.data);
            navigation.navigate('ReviewPage',{data : response.notification.request.content.data});
          });

        AsyncStorage.getAllKeys((err, result) => {
            if (!err) setStore(result.reverse());
        });
    }, []);

    // useEffect(() => {

    //     AsyncStorage.getAllKeys((err, result) => {
    //         if (!err) setStore(result.reverse());
    //     });
    // }, [visibleModal]); // 삭제후 리로드 안해주면 each뭐시기 컴포넌트에서 innerbold 꼬임
    useEffect(() => {
        navigation.addListener('focus', () => {
            AsyncStorage.getAllKeys((err, result) => {
                if (!err) setStore(result.reverse());
            });
        });
    }, [navigation]);
    useEffect(() => {
        AsyncStorage.getAllKeys((err, result) => {
            if (!err) setStore(result.reverse());
        });
    }, [visibleModal]);

    const EachSwitch = (props) => {
        const [isOn, setIsOn] = useState(false);
        const [innerSecond, setInnerSecond] = useState(props.number["whenAlarm"]);
        const [turnOFFAfterTime, setTurnOFFAfterTime] = useState(getEndTime(props.number['time'], Number(props.number["whenAlarm"])));
        
        const [innerEndTime, setInnerEndTime] = useState(props.number["endTime"]);
        const [innerBoldList, setInnerBoldList] = useState([]);
    

        
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
        useEffect(() => {
            AsyncStorage.getItem(JSON.stringify(props.number) , (err, result) => {
                if (result) {
                    // console.log(JSON.parse(result)["boldList"]);
                    setInnerBoldList(JSON.parse(result)["boldList"]);
                }
                else console.log(err);
            });
        }, []);


        return (
            <View style={{ position: 'absolute', top: 30 }}>
                {innerSecond ? <Switch
                    style={styles.eachSwitchPosition}
                    value={isOn}
                    thumbColor="white"
                    trackColor={{ true: "#19925E" }}

                    onValueChange={async (e) => {

                        if (innerSecond !== 0) {
                            setIsOn(!isOn);
                            if (isOn === true) {
                                Notifications.cancelScheduledNotificationAsync(props.identifier);
                            }
                            else {
                                // console.log(props.number);
                                setInnerEndTime(getEndTime(getTime(),innerSecond));
                                

                                Notifications.scheduleNotificationAsync({
                                    content: {
                                        title: props.number["title"],
                                        body: 'Change sides!',
                                        sticky:true,
                                        data: {strData: JSON.stringify({  title: props.number["title"], content: props.number["content"] }), strBoldList: JSON.stringify({ boldList: innerBoldList })}
                                        
                                    },
                                    identifier: props.number["time"],
                                    trigger: {
                                        seconds: innerSecond, //onPress가 클릭이 되면 60초 뒤에 알람이 발생합니다.
                                    },
                                });
                            }
                        }
                    }}
                /> : <View></View>}

                {isOn
                    ? <View style={{ left: SCREEN_WIDTH / 100 * 67, bottom: -25 }}>
                        <Text style={{ color: "black", opacity: 0.35, fontSize: 12 }}>{JSON.stringify(innerEndTime).slice(1, 5) + '-' + JSON.stringify(innerEndTime).slice(5, 7) + '-' + JSON.stringify(innerEndTime).slice(7, 9) + ' ' + JSON.stringify(innerEndTime).slice(9, 11) + ':' + JSON.stringify(innerEndTime).slice(11, 13)}</Text>
                    </View>
                    : <View >
                        <Text style={{ color: "black", opacity: 0.35, fontSize: 12 }}></Text>
                    </View>
                }
            </View>
        );
    }

    const currentTime = useBearStore((state) => state.currentTime);
    return (
        <View style={styles.main}>
            <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
                <ScrollView overScrollMode="never"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                >
            <View style={{ marginTop: 4, marginBottom: 4 }}>

                <TouchableOpacity style={styles.addButton}
                    onPress={() => {
                        navigation.navigate('WritePage');
                    }}><Text style={styles.addText}>+</Text></TouchableOpacity>
                {/* <Button title='전체 알림 리스트 가져오기' onPress={async() => {
                    try {
                        let ggg = await Notifications.getAllScheduledNotificationsAsync();
                        console.log(ggg);
                    } catch (e) {
                        console.log("error");
                    }
                }}/> */}
                {/* <Button title='알림 전체 취소하기' onPress={async() => {
                    try {
                        Notifications.cancelAllScheduledNotificationsAsync();
                        
                    } catch (e) {
                        console.log("error");
                    }
                }}/> */}
            </View>
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
                        style={({  pressed }) => [
                            {
                                backgroundColor: pressed
                                    ? '#DDD'
                                    : 'white'
                            }
                        ]}>
                        <View style={styles.titlelist}>
                            <View >

                                <View style={{ width: Dimensions.get('window').width / 100 * 70, height: Dimensions.get('window').height / 100 * 5.5, position: 'absolute', left: 0, top: 10, backgroundColor: 'white' }}>
                                    <Text >
                                        {/* <Text>{      JSON.stringify(notificationPermissionToken) }</Text> */}
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
                animationType="none"
                transparent={true}
                visible={visibleModal}
                onRequestClose={() => { setVisibleModal(false) }}
            >
                <View style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
                ]}>
                    <View style={{ width: '95%', height: '95%', position: 'absolute', top: '2.5%', left: '2.5%', backgroundColor: 'white', borderRadius: 10 }}>
                        <Text>sfasdff</Text>
                        <View>
                        <Pressable
                            style={styles.container}
                            onPress={() => {
                                
                                Notifications.cancelScheduledNotificationAsync(JSON.parse(JSON.parse(tmpArticle))["time"]);
                                AsyncStorage.removeItem(JSON.parse(tmpArticle)).then(
                                    AsyncStorage.getAllKeys((err, result) => {
                                        if (!err) setStore(result.reverse());
                                    }).then(
                                        setVisibleModal(!visibleModal)
                                    )
                                )

                                
                            }}
                        >
                            <Text>delete</Text>
                        </Pressable>
                    </View>
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
        width: SCREEN_WIDTH / 1.05,
        height: SCREEN_HEIGHT / 100 * 13,
        borderRadius: 4,
        // height: 42,
        margin: 10,
        marginTop: 4,
        marginBottom: 4,
        // justifyContent: 'center',
        textAlign: 'center',
        paddingLeft: 10,

        elevation: 2

    },
    titlelistfont: {
        fontSize: 15,
    },
    eachSwitchPosition: {
        left: SCREEN_WIDTH / 100 * 80,
        backgroundColor: "white",
        width: 40,
        height: 30,
        transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }]
    },
    addButton: {
        left: SCREEN_WIDTH / 1.18,
        zIndex: 1,
        borderRadius: 30,
        backgroundColor: 'white',
        width: SCREEN_WIDTH / 100 * 12.5,
        alignItems: 'center',

        shadowColor: "#0007",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 30,
    },
    addText: {
        fontSize: 33,
    },
});
