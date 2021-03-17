import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat';
import { EasyToast, Loading } from '../../components';
import firebase from '../../utils/firebase';
import 'firebase/firestore';
import { onLongPress, renderActions, renderAvatar, renderBubble, renderLoading, renderMessageImage, renderSend, renderSystemMessage, scrollToBottomComponent } from '../../components/ChatStuff';
import theme from '../../constants/theme';
import sendPushNotification from '../../hooks/PushNotifications/sendPushNotification';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import moment from 'moment';
import * as Sharing from "expo-sharing";
import * as MediaLibrary from 'expo-media-library';

export default function ChatSCreen(props) {
    const { token } = props;
    const [sendLoading, setsendLoading] = useState(false);
    const [sender, setSender] = useState({ _id: '', fullName: '', fcmToken: '' });
    const [receiver, setReceiver] = useState({ _id: '', fullName: '', fcmToken: '' });
    const [isLoading, setisLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [imgDownloadLoading, setimgDownloadLoading] = useState(false);
    const toastRef = useRef();
    const successToastRef = useRef();

    // Hide Bottom Tabbar
    useEffect(() => {
        const parent = props.navigation.dangerouslyGetParent();
        parent.setOptions({
            tabBarVisible: false,
        });
        return () =>
            parent.setOptions({
                tabBarVisible: true,
            });
    }, []);

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
    useEffect(() => {
        if (props.route && props.route.params && props.route.params.sender && props.route.params.receiver) {
            props.navigation.setOptions({ title: props.route.params.receiver.fullName })
            setSender(props.route.params.sender);
            setReceiver(props.route.params.receiver);
        }
        return () => {
        }
    }, [props.route]);

    useEffect(() => {
        if (sender._id !== '' && receiver._id !== '') {
            setisLoading(true);
            try {
                firebase
                    .database()
                    .ref('chats')
                    .child(sender._id > receiver._id ? sender._id : receiver._id)
                    .child(sender._id > receiver._id ? receiver._id : sender._id)
                    .on('value', (dataSnapshot) => {
                        let msgs = [];
                        dataSnapshot && dataSnapshot.forEach((child) => {
                            msgs.push({ ...child.val(), createdAt: JSON.parse(child.val().createdAt), key: child.key });
                            try {
                                if (sender._id === child.val().receiver._id) {
                                    setMerkAsRead(child.key);
                                }
                            } catch (error) {
                            }
                        });
                        setMessages(msgs.reverse());
                        setisLoading(false);
                    })
            } catch (err) {
                setisLoading(false);
                console.log('Loading chat error:', err);
            }
        }
        return () => {
        }
    }, [sender, receiver]);

    useEffect(() => {
        if (messages.length > 0) {
            setisLoading(false);
        }
        return () => { }
    }, [messages]);

    async function setMerkAsRead(msg) {
        let msgsRef = firebase
            .database()
            .ref('chats')
            .child(sender._id > receiver._id ? sender._id : receiver._id)
            .child(sender._id > receiver._id ? receiver._id : sender._id)
            .child(msg)
        msgsRef.update({ received: true });
    }

    async function handleSend(msg) {
        try {
            setsendLoading(true);
            await firebase
                .database()
                .ref('chats')
                .child(sender._id > receiver._id ? sender._id : receiver._id)
                .child(sender._id > receiver._id ? receiver._id : sender._id)
                .push({
                    _id: msg[0]._id,
                    createdAt: JSON.stringify(msg[0].createdAt),
                    text: msg[0].text,
                    sent: true,
                    received: false,
                    receiver: {
                        _id: receiver._id,
                        fullName: receiver.fullName,
                    },
                    user: {
                        _id: sender._id,
                        fullName: sender.fullName,
                    }
                })
            setsendLoading(false);
            if (messages.length < 1) {
                firebase
                    .database()
                    .ref('users')
                    .push({
                        sender: {
                            _id: sender._id,
                            fullName: sender.fullName,
                        },
                        receiver: {
                            _id: receiver._id,
                            fullName: receiver.fullName,
                        }
                    });
            }
            sendPushNotification(
                token,
                receiver._id,
                `New message from ${sender.fullName}`,
                msg[0].text,
                sender
            )
        } catch (err) {
            setsendLoading(false);
            console.log('snd msg err:', err);
        }
    }

    const pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            copyToCacheDirectory: true,
            multiple: false,
        });
        if (result.type === 'success') {
            let fileBase64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
            try {
                setsendLoading(true);
                const formatedDate = moment(new Date(), "MM-DD-YYYY HH:mm:ss");
                await firebase
                    .database()
                    .ref('chats')
                    .child(sender._id > receiver._id ? sender._id : receiver._id)
                    .child(sender._id > receiver._id ? receiver._id : sender._id)
                    .push({
                        _id: JSON.stringify((new Date()).valueOf()),
                        createdAt: JSON.stringify(formatedDate._d),
                        file: fileBase64,
                        sent: true,
                        name: result.name,
                        received: false,
                        receiver: {
                            _id: receiver._id,
                            fullName: receiver.fullName,
                        },
                        user: {
                            _id: sender._id,
                            fullName: sender.fullName,
                        }
                    })
                if (messages.length < 1) {
                    firebase
                        .database()
                        .ref('users')
                        .push({
                            sender: {
                                _id: sender._id,
                                fullName: sender.fullName,
                            },
                            receiver: {
                                _id: receiver._id,
                                fullName: receiver.fullName,
                            }
                        });
                }
                sendPushNotification(
                    token,
                    receiver._id,
                    `New message from ${sender.fullName}`,
                    `File: ${result.name}`,
                    sender
                )
                setsendLoading(false);
            } catch (err) {
                console.log('pickDocument err:', err)
                setsendLoading(false);
                toastRef && toastRef.current && toastRef.current.show('Message send failed, Please try again later.', 2000, () => { });
            }
            setsendLoading(false);
        }
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
                setsendLoading(true);
                let secure_url = '';
                let uploaded = false;
                let data = {
                    "file": `data:image/jpg;base64,${result.base64}`,
                    "upload_preset": "ml_default",
                }
                await fetch('https://api.cloudinary.com/v1_1/dsexrbwj1/image/upload', {
                    body: JSON.stringify(data),
                    headers: {
                        'content-type': 'application/json'
                    },
                    method: 'POST',
                }).then(async res => {
                    let data = await res.json()
                    secure_url = data.url;
                    uploaded = true
                }).catch(err => {
                    toastRef && toastRef.current && toastRef.current.show('Message send failed, Please try again later.', 2000, () => { });
                    setsendLoading(false);
                })
                if (uploaded) {
                    try {
                        const formatedDate = moment(new Date(), "MM-DD-YYYY HH:mm:ss");
                        const name = result.uri.split("/").reverse()[0];
                        await firebase
                            .database()
                            .ref('chats')
                            .child(sender._id > receiver._id ? sender._id : receiver._id)
                            .child(sender._id > receiver._id ? receiver._id : sender._id)
                            .push({
                                _id: JSON.stringify((new Date()).valueOf()),
                                createdAt: JSON.stringify(formatedDate._d),
                                image: secure_url,
                                name: name,
                                sent: true,
                                received: false,
                                receiver: {
                                    _id: receiver._id,
                                    fullName: receiver.fullName,
                                },
                                user: {
                                    _id: sender._id,
                                    fullName: sender.fullName,
                                }
                            });
                        if (messages.length < 1) {
                            firebase
                                .database()
                                .ref('users')
                                .push({
                                    sender: {
                                        _id: sender._id,
                                        fullName: sender.fullName,
                                    },
                                    receiver: {
                                        _id: receiver._id,
                                        fullName: receiver.fullName,
                                    }
                                });
                        }
                        sendPushNotification(
                            token,
                            receiver._id,
                            `New message from ${sender.fullName}`,
                            `Send you a photo: ${name}`,
                            sender
                        )
                        setsendLoading(false);
                    } catch (err) {
                        setsendLoading(false);
                        toastRef && toastRef.current && toastRef.current.show('Message send failed, Please try again later.', 2000, () => { });
                        console.log('snd msg err:', err);
                    }
                }
            }
        }
    };

    async function deleteMessage(message) {
        let userRef = firebase
            .database()
            .ref('chats')
            .child(sender._id > receiver._id ? sender._id : receiver._id)
            .child(sender._id > receiver._id ? receiver._id : sender._id)
            .child(message.key)
        userRef.remove();
    }

    const downloadImage = async message => {
        setimgDownloadLoading(true);
        FileSystem.downloadAsync(
            message.image,
            FileSystem.documentDirectory + message.name
        ).then(({ uri }) => {
            MediaLibrary.createAssetAsync(uri).then(asset => {
                MediaLibrary.createAlbumAsync('OLHS', asset)
                    .then(() => {
                        setimgDownloadLoading(false);
                        successToastRef && successToastRef.current && successToastRef.current.show('Image downloaded successfully.', 2000, () => { });
                    })
                    .catch(error => {
                        console.error(error);
                        toastRef && toastRef.current && toastRef.current.show('Image download failed, Please try again later.', 2000, () => { });
                    });
            });
        }).catch(error => {
            setimgDownloadLoading(false);
            console.error(error);
            toastRef && toastRef.current && toastRef.current.show('Image download failed, Please try again later.', 2000, () => { });
        });
    }

    const downloadFile = async message => {
        try {
            setimgDownloadLoading(true);
            let fileName = FileSystem.documentDirectory + message.name;
            FileSystem.writeAsStringAsync(
                fileName,
                message.file, {
                encoding: FileSystem.EncodingType.Base64,
            })
            await MediaLibrary.createAssetAsync(fileName).then(asset => {
                MediaLibrary.createAlbumAsync('OLHS', asset)
                    .then(() => {
                        setimgDownloadLoading(false);
                        successToastRef && successToastRef.current && successToastRef.current.show('File downloaded successfully.', 2000, () => { });
                    })
                    .catch(error => {
                        console.error(error);
                        toastRef && toastRef.current && toastRef.current.show('File download failed, Please try again later.', 2000, () => { });
                    });
            });
        } catch (err) {
            setimgDownloadLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <EasyToast
                toastRef={toastRef}
                type={'err'}
                position={'top'}
            />
            <EasyToast
                toastRef={successToastRef}
                type={'success'}
                position={'top'}
            />
            {isLoading ?
                <Loading />
                :
                <GiftedChat
                    messages={messages}
                    user={{
                        _id: sender._id,
                        name: sender.fullName
                    }}
                    renderMessageImage={(props) => renderMessageImage(props, sender, receiver)}
                    onLongPress={(context, message) => onLongPress(context, message, deleteMessage, downloadFile, downloadImage)}
                    maxInputLength={1000}
                    onSend={handleSend}
                    renderSend={(props) => renderSend(props, sendLoading)}
                    renderActions={() => renderActions(pickDocument, takePhoto)}
                    renderLoading={renderLoading}
                    renderBubble={renderBubble}
                    isLoadingEarlier={true}
                    scrollToBottomComponent={scrollToBottomComponent}
                    renderCustomView={(props) => renderSystemMessage(props, sender, receiver)}
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
})

