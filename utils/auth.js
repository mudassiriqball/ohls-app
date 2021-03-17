
import jwt_decode from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from "@react-navigation/native";

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import urls from "./urls";
import axios from "axios";

const auth = () => (
    <></>
)

export async function saveTokenToStorage(_token, navigation, getUser) {
    try {
        await AsyncStorage.setItem('bearer_token', _token);
        await AsyncStorage.setItem('decoded_token', JSON.stringify(jwt_decode(_token)));
        getUser();
        const decoded_token = await jwt_decode(_token);
        if (Constants.isDevice) {
            const device_token = (await Notifications.getExpoPushTokenAsync()).data;
            await axios({
                method: 'PUT',
                headers: {
                    'authorization': _token
                },
                url: urls.UPDATE_PROFILE + decoded_token.data._id,
                data: { fcmToken: device_token },
            }).then(res => {
            }).catch(err => {
                console.log('saveFcmToken Error:', err);
            })
        }
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: "Home" }],
            }),
        );
    } catch (err) {
        console.log('save token error:', err)
    }
}

export async function getBearerTokenFromStorage() {
    try {
        const _token = await AsyncStorage.getItem('bearer_token')
        return _token
    } catch (err) {
        console.log('get token error:', err)
        return null
    }
}

export async function removeTokenFromStorage(navigation, _id) {
    const token = await getBearerTokenFromStorage();
    await axios({
        method: 'PUT',
        headers: {
            'authorization': token
        },
        url: urls.UPDATE_PROFILE + _id,
        params: { fcmToken: '' },
    }).then(res => {

    }).catch(err => {
        console.log('removeFcmToken Error:', err);
    })

    try {
        await AsyncStorage.clear();
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: "Home" }],
            }),
        );
    } catch (err) {
        return false;
    }
}

export async function getDecodedTokenFromStorage(navigation) {
    try {
        const _token = await AsyncStorage.getItem('decoded_token')
        if (_token != null) {
            if (JSON.parse(_token).exp < Date.now() / 1000) {
                await AsyncStorage.clear();
                removeTokenFromStorage(navigation);
            } else {
                return JSON.parse(_token).data;
            }
        } else {
            return null;
        }
    } catch (err) {
        console.log('checkTokenExpAuth error:', err)
        return null
    }
}

export default auth;