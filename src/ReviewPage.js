import { Button, Modal, StyleSheet, Text,BackHandler, View, Pressable, StatusBar, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Dimensions } from 'react-native'; //나중에 전역변수로 바꾸기

import { RadioButton } from 'react-native-paper'; // radio button

import AsyncStorage from '@react-native-async-storage/async-storage';

import getTime from '../functions/getTime';

import * as Notifications from 'expo-notifications';

import { Switch } from 'react-native';


export default function ReviewPage({ navigation, route }) {
    const [data, setData] = useState(route.params.data);

    const [boldList, setBoldList] = useState(JSON.parse(route.params.data["strBoldList"])["boldList"]);
    const [content, setContent] = useState(JSON.parse(route.params.data["strData"])["content"] );
    const [clearList, setClearList] = useState([]);
    
    // JSON.parse(route.params.data)
    useEffect(() => {
        try{
            setData(route.params.data);
            setBoldList(JSON.parse(route.params.data["strBoldList"])["boldList"]);
            setContent(JSON.parse(route.params.data["strData"])["content"] );            
            
          }
          catch(error){
            console.log("error");
          }

    }, []);
    
    const backAction = () => {
        Alert.alert("경고", "복습 완료전까지 나갈수 없습니다.", [
          {
            text: "확인",
            onPress: () => null,
            style: "cancel"
          }
        //   ,{ text: "YES", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      };
    
      useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
    
        return () =>
          BackHandler.removeEventListener("hardwareBackPress", backAction);
      }, []);

    const onPressWord = (word) => {
        if (clearList.includes(word)) setClearList(clearList.filter((w) => w !== word));
        else setClearList([...clearList, word]);
      };

    return (

        <View style={{flex:1}}>
            <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
            <View style={{flex:1}}>
            
                    <ScrollView overScrollMode="never"
                    contentContainerStyle={{paddingTop: 15, paddingRight: 15, paddingLeft: 15 }}
                    >
                    {/* <Text>{JSON.stringify(content)}</Text>
                    <Text>boldList:{JSON.stringify(boldList)}</Text> */}
                    <Text>
                        {content.map((word, idx) => (
                                    <Text key={idx + 10}>
                                        {boldList.includes(word)
                                        ?  
                                                <Pressable  onPress={() => onPressWord(word)}>
                                            <Text  style={{ fontSize: 17, textDecorationLine: clearList.includes(word) ? 'line-through' : 'nomal', fontWeight: '900' }}>
                                                {word}
                                            </Text>
                                        </Pressable>
                                         : <Text style={{ fontSize: 17,}}>{word}</Text>}
                                    </Text>
                        ))}
                    </Text>
                    </ScrollView>
            </View>
            <View style={{alignItems:'flex-end'}}>
            <Text style={{marginLeft:10,fontSize:20}}>{JSON.stringify(clearList.length)}/{JSON.stringify(boldList.length)} </Text>

<TouchableOpacity 
style={{ backgroundColor: '#525252', width: Dimensions.get('window').width, height: 50, justifyContent: 'center', alignContent: 'center', }}
title='clear' onPress={
    () => {
        if(clearList.length == boldList.length){
            
            navigation.navigate('Home');
        } 
        else{
            Alert.alert("경고", "복습 완료전까지 나갈수 없습니다. "+JSON.stringify(clearList.length)+"/"+JSON.stringify(boldList.length), [
                {
                  text: "확인",
                  onPress: () => null,
                  style: "cancel"
                }
              //   ,{ text: "YES", onPress: () => BackHandler.exitApp() }
              ])
        }
    }
}><Text style={{ textAlign: 'center', color: 'white' , fontSize:17}}>Clear</Text></TouchableOpacity>
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
});
