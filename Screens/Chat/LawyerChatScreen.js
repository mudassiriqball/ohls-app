import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { Bubble, Composer, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

import firebase from '../../utils/firebase';
import { Loading } from '../../components';
import theme from '../../constants/theme';
import 'firebase/firestore';
import { Entypo, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { Avatar } from 'react-native-paper';

export default function ChatScreen(props) {
    const { navigation } = props;

    const [user, setUser] = useState(null);
    const [lawyer, setLawyer] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    const [file, setFile] = useState(null);

    useEffect(() => {
        if (props.route && props.route.params && props.route.params.user && props.route.params.lawyer) {
            props.navigation.setOptions({
                headerTitle: props.route.params.lawyer.fullName
            })
            setUser(props.route.params.user);
            setLawyer(props.route.params.lawyer);
        }
        return () => {
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0)
            setisLoading(false)
        return () => { }
    }, [messages]);

    useEffect(() => {
        if (user && lawyer)
            try {
                firebase
                    .database()
                    .ref('chats')
                    .child(user && user._id)
                    .child(lawyer && lawyer._id)
                    .on('value', (dataSnapshot) => {
                        let msgs = [];
                        dataSnapshot && dataSnapshot.forEach((child) => {
                            msgs.push({ ...child.val(), createdAt: JSON.parse(child.val().createdAt) });
                        });
                        setMessages(msgs.reverse());
                    })
            } catch (err) {
                console.log('Loading chat error:', err);
            }
        return () => {
        }
    }, [user, lawyer])


    useEffect(() => {
        getPermissionAsync();
    }, []);

    const getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                Alert.alert('Sorry', 'we need camera roll permissions to make this work!');
            }
        }
    };
    const pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            copyToCacheDirectory: true,
            multiple: false,
        });

    }
    const takePhoto = async () => {
        const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);
        const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 4],
                mediaTypes: 'Images',
                quality: 1,
                base64: true
            });
            if (!result.cancelled) {
                try {
                    const formatedDate = moment(new Date(), "MM-DD-YYYY HH:mm:ss");
                    await firebase
                        .database()
                        .ref('chats/' + user._id)
                        .child(lawyer && lawyer._id)
                        .push({
                            _id: JSON.stringify((new Date()).valueOf()),
                            createdAt: JSON.stringify(formatedDate._d),
                            image: `data:image/jpg;base64,${result.base64}`,
                            user: {
                                _id: lawyer._id,
                                name: lawyer.fullName,
                            },
                        })
                } catch (err) {
                    console.log('snd msg err:', err);
                }
            }
        }
    };

    async function handleSend(msg) {
        try {
            await firebase
                .database()
                .ref('chats/' + user._id)
                .child(lawyer && lawyer._id)
                .push({
                    _id: msg[0]._id,
                    createdAt: JSON.stringify(msg[0].createdAt),
                    text: msg[0].text,
                    user: {
                        _id: lawyer._id,
                        name: lawyer.fullName,
                    },
                })
        } catch (err) {
            console.log('snd msg err:', err);
        }
    }

    const renderActions = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                <Ionicons name="document-attach-outline" onPress={pickDocument} size={25} style={{ marginRight: 7, marginLeft: 14 }} color={theme.COLORS.GRAY} />
                <MaterialIcons name="add-a-photo" onPress={takePhoto} size={25} style={{ marginHorizontal: 7 }} color={theme.COLORS.GRAY} />
            </View>
        );
    }
    const renderBubble = props => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: { backgroundColor: theme.COLORS.PRIMARY },
                }}
            />
        );
    }
    const renderAvatar = props => {
        return (
            props.currentMessage.user._id === user._id ?
                null
                :
                <Avatar.Image source={{ uri: lawyer.avatar }} size={35} />
        );
    }
    function scrollToBottomComponent() {
        return (
            <View style={styles.bottomComponentContainer}>
                <Feather icon='chevron-down' size={36} color='red' />
            </View>
        );
    }
    function renderLoading() {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#6646ee' />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            {isLoading ?
                <Loading />
                :
                <GiftedChat
                    messages={messages}
                    user={{
                        _id: lawyer && lawyer._id,
                        name: lawyer && lawyer.fullName,
                    }}
                    maxInputLength={1000}
                    renderAvatar={renderAvatar}
                    onSend={handleSend}
                    renderActions={renderActions}
                    bottomOffset={20}
                    // showUserAvatar={true}
                    renderLoading={renderLoading}
                    renderUsernameOnMessage={true}
                    renderBubble={renderBubble}
                    scrollToBottomComponent={scrollToBottomComponent}
                />
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.COLORS.WHITE,
    },
    toolbarContainer: {
        backgroundColor: theme.COLORS.WHITE,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

