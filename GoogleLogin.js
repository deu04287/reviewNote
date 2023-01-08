import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';

import 'expo-dev-client'
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
  webClientId: '980861576205-g75bbu930586l77rq1rr8pobfcl2ge2p.apps.googleusercontent.com',
});

export default function GoogleLogin() {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    console.log("reload");
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  const signOut = async () => {
    try {
        console.log('로그아웃했씀~')
      await GoogleSignin.revokeAccess();
      await auth().signOut();
    }
    catch (e) {
      console.log(e);
    }
  }
  const onGoogleButtonPress = async () => {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    // return auth().signInWithCredential(googleCredential);
    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in.then((user) => { console.log(user); })
      .catch((e) => { console.log(e); })
  }
  

  if (user) {
    return (
        <View>
          <Text>welcome~</Text>
          <Button title='logout' onPress={signOut}></Button>
        </View>
      );
  }
  else {
    return (
        <View>
          <GoogleSigninButton
            style={{ width: 300, height: 65, marginTop: 300 }}
            onPress={onGoogleButtonPress}
          />
          <Button title='logout' onPress={signOut}></Button>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
