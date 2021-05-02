import React, { useState, useEffect, useRef } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import Input from '../../components/Input';
import theme from '../../constants/theme';
import Layout from '../../constants/theme/Layout';
import Button from '../../components/Button';
import STATUSBAR_HEIGHT from '../../components/StatusBarHeight';
import ids from '../../utils/ids';
import EasyToast from '../../components/Toasts/EasyToast';
import urls from '../../utils/urls';
import axios from 'axios';
import { saveTokenToStorage } from '../../utils/auth';
import { renderError } from '../../components';
import SocialLogin from '../../components/SocialLogin';

export default function Login(props) {
  const { getUser, navigation } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // EasyToast
  const toastRef = useRef();
  const [toastType, setToastType] = useState('');

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: ''
  });

  // Login
  const handleLogin = async () => {
    var emailReg = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailReg.test(username.toLowerCase().trim()) || password.length < 8 || password.length > 20) {
      let emailErr = '';
      let passErr = '';
      if (!emailReg.test(username.toLowerCase().trim())) {
        emailErr = 'Invalid email';
      }
      if (password.length < 8 || password.length > 20) {
        passErr = 'Enter 8-20 characters'
      }
      setErrors({ ...errors, username: emailErr, password: passErr });
    } else {
      setIsLoading(true);
      let data = {};
      data = {
        username: username.toLowerCase().trim(),
        password: password,
        isSocial: false
      };
      axios({
        method: 'POST',
        url: urls.LOGIN,
        data: data
      }).then(async res => {
        setIsLoading(false);
        saveTokenToStorage(res.data.token, navigation, getUser);
      }).catch(err => {
        setIsLoading(false);
        console.log('err', err);
        try {
          if (err.response.status === 400 || err.response.status === 401) {
            setErrors({ ...errors, general: 'Invalid username or password' });
          } else {
            setToastType('err');
            toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 1000, () => {});
          }
        } catch (err) {
          console.log('err', err);
          setToastType('err');
          toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 1000, () => {});
        }
      })
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <EasyToast
        toastRef={toastRef}
        type={toastType}
        position={'top'}
      />
      <View style={styles.background} />
      <View style={styles.loginContainer}>
        <Image source={require('../../assets/images/large_icon.png')} style={styles.logo} />
        <SocialLogin
          navigation={props.navigation}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          getUser={getUser}
        />
        <Text style={styles.socialLogin}>Login Using OLHS</Text>
        <Input
          label={'Email'}
          value={username}
          onChangeText={(val) => { setUsername(val), setErrors({ ...errors, password: '' }) }}
          error={errors.username}
          autoCapitalize="none"
          keyboardType={'email-address'}
          left={<TextInput.Icon name='account' color={theme.COLORS.PRIMARY} size={25} />}
        />
        <Input
          label={'Password'}
          value={password}
          onChangeText={(val) => { setPassword(val), setErrors({ ...errors, password: '' }) }}
          error={errors.password}
          autoCapitalize="none"
          secureTextEntry={showPassword ? false : true}
          left={<TextInput.Icon name='lock' color={theme.COLORS.PRIMARY} size={20} />}
          right={<TextInput.Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.COLORS.PRIMARY} onPress={() => setShowPassword(!showPassword)} />}
        />
        <View style={styles.forgot_password}>
          <Text style={{ color: theme.COLORS.LINK }} onPress={() => props.navigation.navigate('ResetPassword')} > {'Forgot Password ?'} </Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {errors.general !== '' && renderError(errors.general)}
        </View>
        <Button
          title={'Login'}
          mode={'contained'}
          icon='login'
          loading={isLoading}
          disabled={isLoading}
          onPress={() => handleLogin()}
        />
        <View>
          <Text style={styles.text}>Don't have an account ?</Text>
          <Button
            title={'Register'}
            icon='account-plus'
            color={theme.COLORS.WHITE}
            textColor={theme.COLORS.PRIMARY}
            mode='outlined'
            width={'100%'}
            onPress={() => props.navigation.navigate('Register')}
          />
        </View>
      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.COLORS.WHITE,
  },
  background: {
    position: 'absolute',
    width: Layout.window.width,
    height: Layout.window.height / 2,
    backgroundColor: theme.COLORS.PRIMARY,
  },

  // Login
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
  },
  loginContainer: {
    marginTop: STATUSBAR_HEIGHT,
    backgroundColor: theme.COLORS.WHITE,
    margin: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE * 3,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    borderRadius: 5,
    elevation: 3,
  },
  forgot_password: {
    marginLeft: 'auto',
    marginBottom: 10
  },
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

