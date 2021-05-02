import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import AboutUs from '../Screens/AboutUs';
import HomeStack from './Stack/HomeStack';
import theme from '../constants/theme';
import CustomSidebarMenu from './CustomSidebarMenu';
import SettingsStack from './Stack/SettingsStack';
import { AntDesign, Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import ChatStack from './Stack/ChatStack';
import HireLawyerStack from './Stack/HireLawyerStack';
import CaseRequestStack from './Stack/CaseRequestStack';
import AssignedCasesStack from './Stack/AssignedCasesStack';
import MyCasesStack from './Stack/MyCasesStack';

const Drawer = createDrawerNavigator();
const SideDrawer = props => {
  const { isLogged, user } = props;

  return (
    <Drawer.Navigator
      initialRouteName='Home'
      drawerContentOptions={{
        activeTintColor: theme.COLORS.PRIMARY,
        itemStyle: { paddingVertical: 3, marginVertical: 0 },
        labelStyle: { fontSize: 16 }
      }}
      drawerContent={(prop) => <CustomSidebarMenu {...prop}{...props} />}
    >
      <Drawer.Screen
        name="Home"
        options={{
          title: 'Home',
          drawerIcon: ({ focused, size }) => (
            <Ionicons
              name="md-home-outline"
              size={23}
              color={focused ? theme.COLORS.PRIMARY : theme.COLORS.GRAY}
            />
          ),
        }}
      >
        {(prop) => <HomeStack {...prop}{...props} />}
      </Drawer.Screen>
      {isLogged && user ?
        user.role === 'customer' ?
          <>
            <Drawer.Screen
              name="HireLawyer"
              options={{
                title: 'Hire a Lawyer',
                drawerIcon: ({ focused, size }) => (
                  <AntDesign
                    name="pluscircleo"
                    size={23}
                    color={focused ? theme.COLORS.PRIMARY : theme.COLORS.GRAY}
                  />
                ),
              }} >
              {(prop) => <HireLawyerStack {...props}{...prop} />}
            </Drawer.Screen>
            <Drawer.Screen
              name="MyCases"
              options={{
                title: 'My Cases',
                drawerIcon: ({ focused, size }) => (
                  <MaterialIcons
                    name="assignment"
                    size={23}
                    color={focused ? theme.COLORS.PRIMARY : theme.COLORS.GRAY}
                  />
                ),
              }} >
              {(prop) => <MyCasesStack {...props}{...prop} />}
            </Drawer.Screen>
          </>
          :
          <>
            <Drawer.Screen
              name="CaseRequest"
              options={{
                title: 'Case Request',
                drawerIcon: ({ focused, size }) => (
                  <MaterialIcons
                    name="assignment"
                    size={23}
                    color={focused ? theme.COLORS.PRIMARY : theme.COLORS.GRAY}
                  />
                ),
              }} >
              {(prop) => <CaseRequestStack {...props}{...prop} />}
            </Drawer.Screen>

            <Drawer.Screen
              name="AssignedCases"
              options={{
                title: 'Assigned Cases',
                drawerIcon: ({ focused, size }) => (
                  <MaterialIcons
                    name="assignment-turned-in"
                    size={23}
                    color={focused ? theme.COLORS.PRIMARY : theme.COLORS.GRAY}
                  />
                ),
              }} >
              {(prop) => <AssignedCasesStack {...props}{...prop} />}
            </Drawer.Screen>
          </>
        :
        null
      }
      {isLogged &&
        <>
          <Drawer.Screen
            name="Chats"
            options={{
              title: 'Chats',
              drawerIcon: ({ focused, size }) => (
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={23}
                  color={focused ? theme.COLORS.PRIMARY : theme.COLORS.GRAY}
                />
              ),
            }} >
            {(prop) => <ChatStack {...props}{...prop} />}
          </Drawer.Screen>
          <Drawer.Screen
            name="Settings"
            options={{
              title: 'Settings',
              drawerIcon: ({ focused, size }) => (
                <Feather
                  name="settings"
                  size={23}
                  color={focused ? theme.COLORS.PRIMARY : theme.COLORS.GRAY}
                />
              ),
            }} >
            {(prop) => <SettingsStack {...props}{...prop} />}
          </Drawer.Screen>
        </>
      }
      <Drawer.Screen
        name="AboutUs"
        component={AboutUs}
        options={{
          title: 'About us',
          drawerIcon: ({ focused, size }) => (
            <AntDesign
              name="infocirlceo"
              size={23}
              color={focused ? theme.COLORS.PRIMARY : theme.COLORS.GRAY}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  )
}


export default SideDrawer;
