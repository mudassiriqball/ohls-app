import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EasyToast } from './components';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { getBearerTokenFromStorage, getDecodedTokenFromStorage } from './utils/auth';
import urls from './utils/urls';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App(props) {
  const [user, setUser] = useState({
    _id: '',
    username: '',
    mobile: '',
    fullName: '',
    password: '',
    licenseNo: '',
    address: '',
    city: '',
    avatar: '',
    block_list: [],
    role: '',
    status: '',
    entry_date: '',
  });

  const colorScheme = useColorScheme();
  const [token, setToken] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const toastRef = useRef();

  useEffect(() => {
    getUser();
    return () => {
      getUser;
    }
  }, []);

  // Push notifications 
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

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

  const getUser = async () => {
    try {
      const decoded_token = await getDecodedTokenFromStorage(props.navigation);
      if (decoded_token !== null) {
        setUser(decoded_token);
        setIsLogged(true);
        setIsLogged(true);
        await axios({
          method: 'GET',
          url: urls.USER_BY_ID + decoded_token._id,
        }).then(res => {
          setUser(res.data.data);
          if (res.data.data.role === 'lawyer' && res.data.data.status === 0) {
            toastRef && toastRef.current && toastRef.current.show('Your account is not Approved yet, Your provfile is not visible to cutomers!', 300, () => { });
          } else if (res.data.data.role === 'lawyer' && res.data.data.status === 2) {
            toastRef && toastRef.current && toastRef.current.show('Your account is not Restricted, Your provfile is not visible to cutomers!', 300, () => { });
          }
        }).catch(err => {
          console.log('getting user error:', err)
        })
        const bearer_token = getBearerTokenFromStorage();
        if (bearer_token !== null) {
          setToken(bearer_token);
        }
      }
    } catch (err) {
      console.log('getUser err:', err)
    }
  }

  return (
    <SafeAreaProvider>
      <EasyToast
        toastRef={toastRef}
        type={'warn'}
        position={'top'}
      />
      <Navigation
        colorScheme={colorScheme}
        isLogged={isLogged}
        setIsLogged={setIsLogged}
        user={user}
        getUser={getUser}
        setUser={setUser}
        token={token}
        {...props}
      />
      <StatusBar style="light" />
    </SafeAreaProvider>
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
