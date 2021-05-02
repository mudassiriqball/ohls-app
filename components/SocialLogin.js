import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
import theme from '../constants/theme';

import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import EasyToast from './Toasts/EasyToast';
import ids from '../utils/ids';
import axios from 'axios';
import urls from '../utils/urls';
import { saveTokenToStorage } from '../utils/auth';

export default function SocialLogin(props) {
  const { navigation, isLoading, setIsLoading, getUser } = props;
  // EasyToast
  const toastRef = useRef();
  const [toastType, setToastType] = useState('');

  useEffect(() => {
    initFb();
    return () => {
    }
  }, []);
  const initFb = async () => {
    await Facebook.initializeAsync({
      appId: '3567149010069226',
    });
  }

  // Social login
  const handleSocialLogin = async (user, type) => {
    setIsLoading(true);
    let data = {};
    data = {
      username: user.email,
      isSocial: true
    }
    axios({
      method: 'POST',
      url: urls.LOGIN,
      data: data
    }).then(res => {
      setIsLoading(false);
      saveTokenToStorage(res.data.token, navigation, getUser);
    }).catch(err => {
      setIsLoading(false);
      console.log('handleSocialLogin err:', err);
      try {
        if (err.response.status === 400) {
          navigation.navigate('Register', { user: user, type: type });
        } else {
          setToastType('err');
          toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 1000, () => {});
        }
      } catch (err) {
        console.log('handleSocialLogin err 1:', err);
        setToastType('err');
        toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 1000, () => {});
      }
    })
  }

  // Google Login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { type, accessToken, user } = await Google.logInAsync({
        androidStandaloneAppClientId: ids.androidStandaloneAppClientId,
        androidClientId: ids.GOOGLE_CLIENT_ID,
        scopes: ['profile', 'email'],
      });
      if (type === 'success') {
        let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        handleSocialLogin(user, 'google');
      } else {
        setIsLoading(false);
        setToastType('err');
        toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later! Type not success', 1000, () => {});
        // toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 1000, () => { });
      }
    } catch (err) {
      setIsLoading(false);
      console.log('google error:', err)
      setToastType('err');
      toastRef && toastRef.current && toastRef.current.show(err, 1000, () => {});
      // toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 1000, () => { });
    }
  }

  // FB Login
  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      await Facebook.initializeAsync({
        appId: ids.FACEBOOK_APP_ID,
      });
      const {
        type,
        token,
        expirationDate,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
        behavior: 'web'
      });
      if (type === 'success') {
        const response = await fetch(`https://graph.facebook.com/me?fields=email,name,picture&access_token=${token}`);
        const user = await response.json();
        handleSocialLogin(user, 'fb');
      } else {
        setIsLoading(false);
        console.log('fb err');
      }
    } catch (err) {
      setIsLoading(false);
      console.log('err:', err)
      setToastType('err');
      toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 1000, () => {});
    }
  }

  return (
    <View style={styles.social}>
      <EasyToast
        toastRef={toastRef}
        type={toastType}
        position={'top'}
      />
      <Text style={styles.socialLogin}>Login Using</Text>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <View style={[styles.avatar, , isLoading && { opacity: theme.MODEL_OPACITY }]}>
          <AntDesign
            onPress={() => handleGoogleLogin()}
            name="google"
            size={30}
            color={theme.COLORS.WHITE}
            disabled={isLoading}
          />
        </View>
        <View style={{ width: 30 }} />
        <View style={[styles.avatar, { backgroundColor: theme.COLORS.FACEBOOK }, isLoading && { opacity: theme.MODEL_OPACITY }]}>
          <FontAwesome
            onPress={() => handleFacebookLogin()}
            name="facebook"
            size={30}
            color={theme.COLORS.WHITE}
            disabled={isLoading}
          />
        </View>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  // Register
  text: {
    fontSize: 12,
    color: theme.COLORS.GRAY,
    marginTop: 20,
  },

  // Social
  social: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialLogin: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.COLORS.GRAY,
    marginVertical: 20,
    textAlign: 'center'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.COLORS.GOOGLE,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

