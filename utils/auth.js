
import jwt_decode from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from "@react-navigation/native";

const auth = () => (
    <></>
)

export async function saveTokenToStorage(_token, navigation, getUser) {
    try {
        await AsyncStorage.setItem('bearer_token', _token);
        await AsyncStorage.setItem('decoded_token', JSON.stringify(jwt_decode(_token)));
        getUser();
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

export async function removeTokenFromStorage(navigation) {
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