import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Header from '../../components/Header';
import Settings from '../../Screens/Setting/Settings';
import ChangePassword from '../../Screens/Setting/ChangePassword';
import UpdateProfile from '../../Screens/Setting/UpdateProfile';
import MyPortfolio from '../../Screens/Setting/MyPortfolio';
import MyHandledCases from '../../Screens/Setting/MyHandledCases';

const Stack = createStackNavigator();

export default function SettingsStack(props) {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen
        name="Settings"
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title={"Settings"}
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      >
        {(prop) => <Settings {...props}{...prop} />}
      </Stack.Screen>
      <Stack.Screen
        name="ChangePassword"
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title={"Change Password"}
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
        name="UpdateProfile"
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title={"Update Profile"}
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      >
        {(prop) => <UpdateProfile {...props}{...prop} />}
      </Stack.Screen>
      <Stack.Screen
        name="MyPortfolio"
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title={"My Portfolio"}
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      >
        {(prop) => <MyPortfolio {...props}{...prop} />}
      </Stack.Screen>
      <Stack.Screen
        name="MyHandledCases"
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title={"My Handled Cases"}
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      >
        {(prop) => <MyHandledCases {...props}{...prop} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}