import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Header from '../../components/Header';
import Chats from '../../Screens/Chat/Chats';
import ChatScreen from '../../Screens/Chat/ChatScreen';
import LawyerChats from '../../Screens/Chat/LawyerChats';
import LawyerChatScreen from '../../Screens/Chat/LawyerChatScreen';

const Stack = createStackNavigator();

export default function ChatStack(props) {
    const { user } = props;

    return (
        <Stack.Navigator>
            {user && user.role === 'customer' ?
                <>
                    <Stack.Screen
                        name="Chats"
                        options={{
                            header: ({ navigation, scene }) => (
                                <Header
                                    back
                                    title={"Chats"}
                                    navigation={navigation}
                                    scene={scene}
                                />
                            ),
                            cardStyle: { backgroundColor: "#F8F9FE" }
                        }}
                    >
                        {(prop) => <Chats {...props}{...prop} />}
                    </Stack.Screen>
                    <Stack.Screen
                        name="ChatScreen"
                        options={{
                            header: ({ navigation, scene, route }) => (
                                <Header
                                    back
                                    title={route && route.params && route.params.user.fullName ? route.params.user.fullName : 'Chat'}
                                    navigation={navigation}
                                    scene={scene}
                                />
                            ),
                            cardStyle: { backgroundColor: "#F8F9FE" }
                        }}
                    >
                        {(prop) => <ChatScreen {...props}{...prop} />}
                    </Stack.Screen>
                </>
                :
                user && user.role === 'lawyer' &&
                <>
                    <Stack.Screen
                        name="LawyerChats"
                        options={{
                            header: ({ navigation, scene, route }) => (
                                <Header
                                    back
                                    title={"Chats"}
                                    navigation={navigation}
                                    scene={scene}
                                />
                            ),
                            cardStyle: { backgroundColor: "#F8F9FE" }
                        }}
                    >
                        {(prop) => <LawyerChats {...props}{...prop} />}
                    </Stack.Screen>
                    <Stack.Screen
                        name="LawyerChatScreen"
                        options={{
                            header: ({ navigation, scene }) => (
                                <Header
                                    back
                                    title={route && route.params && route.params.lawyer.fullName ? route.params.lawyer.fullName : 'Chat'}
                                    navigation={navigation}
                                    scene={scene}
                                />
                            ),
                            cardStyle: { backgroundColor: "#F8F9FE" }
                        }}
                    >
                        {(prop) => <LawyerChatScreen {...props}{...prop} />}
                    </Stack.Screen>
                </>
            }
        </Stack.Navigator>
    );
}