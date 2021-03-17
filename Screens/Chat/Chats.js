import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@react-navigation/native';
import firebase from '../../utils/firebase';
import 'firebase/firestore';
import { Avatar, Badge, FAB } from 'react-native-paper';
import Loading from '../../components/Loading';
import theme from '../../constants/theme';
import { ScrollView } from 'react-native'

export default function Chats(props) {
    const { navigation, user } = props;
    const [chatUser, setchatUser] = useState({ _id: '', fullName: '' })
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
            try {
                setisLoading(true);
                firebase
                    .database()
                    .ref('users')
                    .on('value', (dataSnapshot) => {
                        let arr = [];
                        dataSnapshot && dataSnapshot.forEach((child) => {
                            let sender = child.val().sender;
                            let receiver = child.val().receiver;

                            if (sender._id === chatUser._id) {
                                let count = 0;
                                firebase
                                    .database()
                                    .ref('chats')
                                    .child(sender._id > receiver._id ? sender._id : receiver._id)
                                    .child(sender._id > receiver._id ? receiver._id : sender._id)
                                    .on('value', (dataSnapshot) => {
                                        dataSnapshot && dataSnapshot.forEach((child) => {
                                            if (child.val().received === false && child.val().user._id !== sender._id) {
                                                count++;
                                            }
                                        });
                                    })
                                arr.push({ user: receiver, isNew: count });
                            } else if (receiver._id === chatUser._id) {
                                let count = 0;
                                firebase
                                    .database()
                                    .ref('chats')
                                    .child(sender._id > receiver._id ? sender._id : receiver._id)
                                    .child(sender._id > receiver._id ? receiver._id : sender._id)
                                    .on('value', (dataSnapshot) => {
                                        dataSnapshot && dataSnapshot.forEach((child) => {
                                            if (child.val().received === false && child.val().user._id !== receiver._id) {
                                                count++;
                                            }
                                        });
                                    })
                                arr.push({ user: sender, isNew: count });
                            }
                        });
                        setUsers(arr.reverse());
                        setisLoading(false);
                    })
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
                        onPress={() => navigation.navigate('ChatScreen', { sender: chatUser, receiver: element.user })}
                        style={styles.userContaier}
                    >
                        <View style={styles.avatarContainer}>
                            <View style={styles.txtAvatar}>
                                <Text style={{ color: theme.COLORS.WHITE, fontSize: 18 }}>{element && element.user.fullName && element.user.fullName.substring(0, 2).toUpperCase()}</Text>
                            </View>
                            {element.isNew > 0 && <Badge style={{ position: 'absolute', }}>{element.isNew}</Badge>}
                        </View>
                        <View style={styles.txtContainer}>
                            <Text style={{ color: theme.COLORS.TEXT, fontSize: 14, fontWeight: 'bold' }}>{element && element.user.fullName}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            }
            <FAB
                style={styles.fab}
                icon="message-bulleted"
                color={theme.COLORS.WHITE}
                onPress={() => navigation.navigate('NewChat')}
            />
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
})



