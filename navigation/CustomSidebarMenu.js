// Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/

import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import theme from '../constants/theme';
import STATUSBAR_HEIGHT from '../components/StatusBarHeight';
import Button from '../components/Button';
import Constants from 'expo-constants';
import { removeTokenFromStorage } from '../utils/auth';
import { AntDesign } from '@expo/vector-icons';

const CustomSidebarMenu = (props) => {
  const { user, token, isLogged, navigation, setIsLogged, setUser } = props;
  const logout = () => {
    setIsLogged(false);
    setUser(null);
    removeTokenFromStorage(navigation, user._id);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.avatarContainer, isLogged && { flexDirection: 'column' }]}>
        <Image
          source={!isLogged || user.avatar === '' ?
            require('../assets/images/avatar.jpg')
            :
            { uri: user.avatar }
          }
          style={styles.avatar}
        />
        {isLogged ?
          <Text style={{ color: theme.COLORS.WHITE }}>{user.fullName}</Text>
          :
          <Button
            title={'Login / Register'}
            uppercase={false}
            small
            onPress={() => props.navigation.navigate('Login')}
          />
        }
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList   {...props} />
        <View style={{ borderTopColor: theme.COLORS.SHADOW, borderTopWidth: 1, marginVertical: 20 }} />
        {isLogged &&
          <DrawerItem
            label="Logout"
            onPress={() => logout()}
            icon={({ focused, color, size }) => <AntDesign color={theme.COLORS.GRAY} size={20} name={'logout'} />}
          />
        }
        <DrawerItem
          label={'Version ' + Constants.manifest.version}
          onPress={() => logout()}
        // icon={({ focused, color, size }) => <AntDesign color={theme.COLORS.WHITE} size={20} name={'logout'} />}
        />
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    height: theme.LAYOUT.window.height / 3.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: STATUSBAR_HEIGHT + 30,
    // paddingBottom: 30,
    paddingHorizontal: 10,
    backgroundColor: theme.COLORS.PRIMARY,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

export default CustomSidebarMenu;
