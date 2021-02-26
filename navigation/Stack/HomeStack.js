import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../../Screens/Home";
import Header from '../../components/Header';
import Login from '../../Screens/Auth/Login';
import Register from '../../Screens/Auth/Register/Register';
import ChangePassword from '../../Screens/Setting/ChangePassword';
import ViewLawyerProfile from '../../Screens/ViewLawyerProfile';

const Stack = createStackNavigator();

export default function HomeStack(props) {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                options={{
                    header: ({ navigation, scene }) => (
                        <Header
                            title={"Home"}
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    cardStyle: { backgroundColor: "#F8F9FE" }
                }}
            >
                {(prop) => <Home {...prop} {...props} />}
            </Stack.Screen>
            <Stack.Screen
                name="Login"
                options={{
                    header: ({ navigation, scene }) => (
                        <Header
                            back
                            title={"Login"}
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    cardStyle: { backgroundColor: "#F8F9FE" }
                }}
            >
                {(prop) => <Login {...prop}{...props} />}
            </Stack.Screen>
            <Stack.Screen
                name="Register"
                options={{
                    header: ({ navigation, scene }) => (
                        <Header
                            back
                            title={"Register"}
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    cardStyle: { backgroundColor: "#F8F9FE" }
                }}
            >
                {(prop) => <Register {...props} {...prop} />}
            </Stack.Screen>
            <Stack.Screen
                name="ResetPassword"
                options={{
                    header: ({ navigation, scene }) => (
                        <Header
                            back
                            title={"Reset Password"}
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    cardStyle: { backgroundColor: "#F8F9FE" }
                }}
            >
                {(prop) => <ChangePassword {...prop}{...props} />}
            </Stack.Screen>
            <Stack.Screen
                name="ViewLawyerProfile"
                component={ViewLawyerProfile}
                options={{
                    header: ({ navigation, scene }) => (
                        <Header
                            back
                            title={"Lawyer Profile"}
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    cardStyle: { backgroundColor: "#F8F9FE" }
                }}
            />
        </Stack.Navigator>
    );
}