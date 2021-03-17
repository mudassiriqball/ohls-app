import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Header from '../../components/Header';
import Chats from '../../Screens/Chat/Chats';
import ChatScreen from '../../Screens/Chat/ChatScreen';
import NewChat from '../../Screens/Chat/NewChat';
import theme from '../../constants/theme';

const Stack = createStackNavigator();

export default function ChatStack(props) {
    const { user } = props;

    return (
        <Stack.Navigator>
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
                    title: 'Chat Screen',
                    headerStyle: {
                        backgroundColor: theme.COLORS.PRIMARY,
                    },
                    headerTintColor: 'white',
                    headerTitleStyle: {
                        alignSelf: 'center',
                        marginRight: 50
                    },
                }}
            >
                {(prop) => <ChatScreen {...props}{...prop} />}
            </Stack.Screen>
            <Stack.Screen
                name="NewChat"
                options={{
                    header: ({ navigation, scene, route }) => (
                        <Header
                            back
                            title={'New Chat'}
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    cardStyle: { backgroundColor: "#F8F9FE" }
                }}
            >
                {(prop) => <NewChat {...props}{...prop} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}