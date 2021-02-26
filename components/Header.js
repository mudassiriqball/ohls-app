import React from 'react';
import { withNavigation } from "@react-navigation/compat";
import { StyleSheet } from "react-native";
import theme from "../constants/theme";
import { Appbar } from 'react-native-paper';


function Header(props) {
  const {
    navigation,
    back,
    title,
  } = props;

  return (
    <Appbar.Header style={[styles.shadow, { backgroundColor: theme.COLORS.PRIMARY }]}>
      {back ?
        <Appbar.BackAction color={theme.COLORS.WHITE} onPress={navigation.goBack} />
        :
        <Appbar.BackAction color={theme.COLORS.PRIMARY} onPress={() => { }} />
      }
      <Appbar.Content title={title} titleStyle={{ color: theme.COLORS.WHITE, textAlign: 'center' }} />
      <Appbar.Action icon="menu" color={theme.COLORS.WHITE} onPress={() => navigation.toggleDrawer()} />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  title: {
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  navbar: {
    paddingVertical: 0,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
});

export default withNavigation(Header);
