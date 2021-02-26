import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Loading } from '../../components';
import theme from '../../constants/theme';

import 'firebase/firestore';
import urls from '../../utils/urls';
import axios from 'axios';
import { Avatar } from 'react-native-paper';

export default function Chats(props) {
    const { navigation, route, user } = props;


    const [isLoading, setisLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        setisLoading(true);
        axios({
            method: 'GET',
            url: urls.ALL_APPROVED_LAWYERS,
        }).then(res => {
            setUsers(res.data.data);
            setisLoading(false);
        }).catch(err => {
            console.log('err:', err)
            setisLoading(false);
        })
    }

    return (
        <View style={styles.container}>
            {isLoading ?
                <Loading />
                :
                users && users.map((element, index) => (
                    <TouchableOpacity key={index}
                        onPress={() => navigation.navigate('ChatScreen', { user: user, lawyer: element })}
                        style={styles.userContaier}
                    >
                        <View style={styles.avatarContainer}>
                            {element && element.avatar ?
                                <Avatar.Image size={50} source={{ uri: element.avatar }} />
                                :
                                <View style={styles.txtAvatar}>
                                    <Text style={{ color: theme.COLORS.WHITE }}>{element && element.fullName.substring(0, 2).toUpperCase()}</Text>
                                </View>
                            }
                        </View>
                        <View style={styles.txtContainer}>
                            <Text style={{ color: theme.COLORS.TEXT, fontSize: 16, fontWeight: 'bold' }}>{element && element.fullName}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.COLORS.WHITE,
        padding: theme.SIZES.BASE
    },
    userContaier: {
        flexDirection: 'row',
        padding: 10,

    },
    avatarContainer: {
        width: '20%',
        marginBottom: 10
    },
    txtContainer: {
        borderBottomColor: theme.COLORS.SHADOW,
        borderBottomWidth: 1,
        width: '80%',
    },
    txtAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.COLORS.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center'
    },
})

