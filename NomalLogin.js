import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';

import 'expo-dev-client'
import auth from '@react-native-firebase/auth';

export default function NomalLogin() {

    //   const [initializing, setInitializing] = useState(true);
    //   const [user, setUser] = useState();
    //   function onAuthStateChanged(user) {
    //     setUser(user);
    //     if (initializing) setInitializing(false);
    //   }

    //   useEffect(() => {
    //     console.log("reload");
    //     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    //     return subscriber; // unsubscribe on unmount
    //   }, []);

    //   if (initializing) return null;

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    return (
        <View>
            <View>
                <Text>아이디</Text>
                <TextInput value={id} onChange={(e) => {
                    e.preventDefault();
                    const { eventCount, target, text } = e.nativeEvent;
                    setId(text);
                }} />
            </View>
            <View>
                <Text>비번</Text>
                <TextInput value={pw} onChange={(e) => {
                    e.preventDefault();
                    const { eventCount, target, text } = e.nativeEvent;
                    setPw(text);
                }} />
            </View>
            <Button title='회원가입' onPress={(e) => {
                e.preventDefault();
                console.log(id);
                console.log(pw);
                // auth()
                //     .createUserWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
                //     .then(() => {
                //         console.log('User account created & signed in!');
                //     })
                //     .catch(error => {
                //         if (error.code === 'auth/email-already-in-use') {
                //             console.log('That email address is already in use!');
                //         }

                //         if (error.code === 'auth/invalid-email') {
                //             console.log('That email address is invalid!');
                //         }

                //         console.error(error);
                //     });
                
                    auth().signOut();
            }} />

        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
