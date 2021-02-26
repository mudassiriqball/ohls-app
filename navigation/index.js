import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import * as React from 'react';

// import NotFoundScreen from '../screens/NotFoundScreen';
import SideDrawer from './SideDrawer';

export default function Navigation(props) {
  return (
    <NavigationContainer theme={props.colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SideDrawer {...props} />
    </NavigationContainer>
  );
}