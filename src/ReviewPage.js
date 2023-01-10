import { Button, Modal, StyleSheet, Text,BackHandler, View, Pressable, StatusBar, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Dimensions } from 'react-native'; //나중에 전역변수로 바꾸기

import { RadioButton } from 'react-native-paper'; // radio button

import AsyncStorage from '@react-native-async-storage/async-storage';

import getTime from '../functions/getTime';

import * as Notifications from 'expo-notifications';

import { Switch } from 'react-native';


export default function ReviewPage({ navigation, route }) {
    const [data, setData] = useState(false);

    const [boldList, setBoldList] = useState(false);
    const [content, setContent] = useState(false);
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
        Alert.alert("Hold on!", "Are you sure you want to go back?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YES", onPress: () => BackHandler.exitApp() }
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

        <View >
            <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
            {data ?
                <View>
                    <ScrollView>
                    {/* <Text>{JSON.stringify(content)}</Text>
                    <Text>boldList:{JSON.stringify(boldList)}</Text> */}
                    <Text>
                        {content.map((word, idx) => (
                                    <Text key={idx + 10}>
                                        {boldList.includes(word)
                                        ?  
                                                <Pressable  onPress={() => onPressWord(word)}>
                                            <Text  style={{textDecorationLine: clearList.includes(word) ? 'line-through' : 'nomal', fontWeight: 'bold' }}>
                                                {word}
                                            </Text>
                                        </Pressable>
                                         : <Text >{word}</Text>}
                                    </Text>
                        ))}
                    </Text>
                    <Text>{JSON.stringify(clearList.length)}/{JSON.stringify(boldList.length)}</Text>

                    <Button title='clear' onPress={
                        () => {
                            if(clearList.length == boldList.length){
                                
                                navigation.navigate('Home');
                            } 
                        }
                    }></Button>
                    </ScrollView>
                </View>
                :
                <View>
                    <Text>error page</Text>
                </View>
            }
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
