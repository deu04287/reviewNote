import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import * as Device from 'expo-device';

import React, { useState, useEffect, useContext } from 'react';
import { Alert, Button, Modal, StyleSheet, Text, View, Pressable, ScrollView, StatusBar, TextInput, TouchableOpacity } from 'react-native';

import TimeSelector from './TimeSelector'; // 드래그해서 시간 설정하는거 가져오는 코드

import moment from 'moment'; //모멘트 js 시간관련
import { DateTimePicker, DateTimePickerAndroid} from '@react-native-community/datetimepicker';

import { getLocales, getCalendars } from 'expo-localization'; // 위치
// export default function Test() {

//   var date = moment().utcOffset('+00:00').format(' hh:mm:ss a');

//   const deviceLanguage = getLocales()[0].languageCode;
//   // console.log(JSON.stringify(getCalendars()));
//   const dsfds = async() => {
//     let a = await Device.getUptimeAsync();
//     console.log(JSON.stringify(a));
  
//   }
//   // dsfds();
//   console.log('date',date);
//   return (
//     // <View style={styles.main}>
//     <View style={styles.main}>
//       <Text>------------------------------------------------</Text>
//        <TimeSelector limit = {62.5} defaultOffsetHour = {6}/> 

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   main: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   scroll: {
//     flex: 1,
//     flexDirection:'row',
//     alignItems:'center',
//     width: 300,
//     backgroundColor: "tomato",
//   },
//   scroll4: {

//     backgroundColor: "green",  },
//   scroll2: {
//     flex: 9,
//     backgroundColor: "#DDD",
//   },
//   scroll3: {

//     backgroundColor: "blue",
//   },
  
// });

export default function Test() {
  const [date, setDate] = useState(new Date(1598051730000));

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
      display:'spinner',
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View>
      <Text>-----------</Text>
      <Button onPress={showDatepicker} title="Show date picker!" />
      <Button onPress={showTimepicker} title="Show time picker!" />
      <Text>selected: {date.toLocaleString()}</Text>
    </View>
  );
};