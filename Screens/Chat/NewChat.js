import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import 'firebase/firestore';
import urls from '../../utils/urls';
import axios from 'axios';
import theme from '../../constants/theme';
import { Loading } from '../../components';

export default function NewChat(props) {
    const { navigation, route, user } = props;
    const [chatUser, setchatUser] = useState({ _id: '', fullName: '', });
    useEffect(() => {
        if (user) {
            setchatUser(user);
        }
        return () => {
        }
    }, [user]);


    const [isLoading, setisLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (chatUser._id !== '') {
            let url = '';
            if (chatUser.role === 'lawyer') {
                url = urls.ALL_CUSTOMERS;
            } else {
                url = urls.ALL_APPROVED_LAWYERS;
            }
            try {
                setisLoading(true);
                axios({
                    method: 'GET',
                    url: url,
                }).then(res => {
                    setUsers(res.data.data);
                    setisLoading(false);
                }).catch(err => {
                    setisLoading(false);
                    console.log('Get User home club Error:', err);
                });
            } catch (err) {
                setisLoading(false);
                console.log('Loading chat error:', err);
            }
        }
        return () => { }
    }, [chatUser]);

    useEffect(() => {
        return () => { }
    }, [users]);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: theme.SIZES.BASE }}>
            {isLoading ?
                <Loading />
                :
                users && users.map((element, index) => (
                    <TouchableOpacity key={index}
                        onPress={() => navigation.navigate('ChatScreen', { sender: chatUser, receiver: element })}
                        style={styles.userContaier}
                    >
                        <View style={styles.avatarContainer}>
                            <View style={styles.txtAvatar}>
                                <Text style={{ color: theme.COLORS.WHITE, fontSize: 18 }}>{element.fullName && element.fullName.substring(0, 2).toUpperCase()}</Text>
                            </View>
                        </View>
                        <View style={styles.txtContainer}>
                            <Text style={{ color: theme.COLORS.TEXT, fontSize: 14, fontWeight: 'bold' }}>{element.fullName}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            }
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    userContaier: {
        flexDirection: 'row',
        padding: 5,
    },
    avatarContainer: {
        width: '20%',
    },
    txtContainer: {
        borderBottomColor: theme.COLORS.SHADOW,
        borderBottomWidth: 1,
        width: '80%',
        justifyContent: 'center',
        paddingLeft: 20,
    },
    txtAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.COLORS.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        backgroundColor: theme.COLORS.PRIMARY,
        bottom: 0,
    },
});

