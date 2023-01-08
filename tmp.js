/////////////221216 임시저장////////////
// import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
// import GoogleLogin from './GoogleLogin';
// import NomalLogin from './NomalLogin';

import 'expo-dev-client'
import AsyncStorage from '@react-native-async-storage/async-storage';

import getTime from './getTime';


// import useStore from './zustandStore'; //zustand 1

const removeAll = () => {
    AsyncStorage.clear();
}

export default function Home({navigation}) {
    // const {count, increaseCount} = useStore(state => state);//zustand 2
    const [store, setStore] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          console.log("default useEffect");
          AsyncStorage.getAllKeys((err, result) => {
            if (!err) {
                console.log(result); // User1 출력
                setStore(result);
            }
        });
        });
    
        return () => {
          unsubscribe;
        };
      }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          console.log("navigation useEffect");
          AsyncStorage.getAllKeys((err, result) => {
            if (!err) {
                console.log(result); // User1 출력
                setStore(result);
            }
        });
        });
    
        return () => {
          unsubscribe;
        };
      }, [navigation]);

    const addTodo = () => {
        let tmpDate = JSON.stringify(getTime());
        // let tmpDate = JSON.stringify("2022121404159");

        let b = [...store];
        b.push(tmpDate);

        setStore(b);
        console.log(store);
        AsyncStorage.setItem(tmpDate, 'sdfsasdf');
    }

    return (
        <View >
            <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
            <View>
                <Button title="add" onPress={addTodo}></Button>
                <Button title="clear" onPress={removeAll}></Button>

                <Button title='회원가입' onPress={() => {
                    navigation.navigate('WritePage');
                }}></Button>
                                <Button title='testzustand' onPress={() => {
                    navigation.navigate('TestZustand');
                }}></Button>
            </View>

            <View>
                {store.map((number, idx) =>
                    <Text key={idx}>{number}</Text>
                )}
            </View>

            {/* <Text>{count}</Text>
<Button title='increaseCount' onPress={() => {increaseCount();}}></Button> */}
            {/**zustand 3 */}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#888',
        alignItems: 'center',
        justifyContent: 'center',
    },
    one: {
        backgroundColor: '#fff',
    },
    one2: {

    },
    one3: {

    },
});

///////////구글 로그인성공하면 나오는 정보들/////////////
const aa = {
    "additionalUserInfo": {
      "isNewUser": true,
      "profile": {
        "aud": "980861576205-g75bbu930586l77rq1rr8pobfcl2ge2p.apps.googleusercontent.com",
        "azp": "980861576205-k782bmn38gi7bm94l1nlku4neunipe4r.apps.googleusercontent.com",
        "email": "kst04281@gmail.com",
        "email_verified": true,
        "exp": 1670383794,
        "family_name": "Shdb",
        "given_name": "Heic",
        "iat": 1670380194,
        "iss": "https://accounts.google.com",
        "locale": "ko",
        "name": "Heic Shdb",
        "picture": "https://lh3.googleusercontent.com/a/AEdFTp7zbVeDT26UD8oEhcGuQbSSu80xKvtM9YpE7ylI=s96-c",
        "sub": "117904387647192548722"
      },
      "providerId":
        "google.com"
    },
    
    "user": {
      "displayName": "Heic Shdb",
      "email": "kst04281@gmail.com",
      "emailVerified": true,
      "isAnonymous": false,
      "metadata": [Object],
      "multiFactor": [Object],
      "phoneNumber": null,
      "photoURL": "https://lh3.googleusercontent.com/a/AEdFTp7zbVeDT26UD8oEhcGuQbSSu80xKvtM9YpE7ylI=s96-c",
      "providerData": [Array],
      "providerId": "firebase",
      "tenantId": null,
      "uid": "NknO4XMZkHbYo5LpbjOhH5Zenb73"
    }
  }