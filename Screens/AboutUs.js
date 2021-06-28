import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import theme from '../constants/theme';

export default function AboutUs() {
  return (
    <View style={styles.container}>
      <Text style={{ color: theme.COLORS.TEXT, lineHeight: 30, textAlign: 'justify' }}>
        OHLS is an independent and general public system, beneficial website. Every person can use it online without a fee. The OLHS is not a part of a larger system, it is an independent system. People from different regions of Pakistan can connect to it and hire best lawyer within their city.
        Online Lawyer Hiring System does not require any specific computer knowledge to use it except the developers. Standard users should be an adult.
        User both client and lawyers will create portfolios. Client wants to file a case OLHS will assist the client in recommending best lawyer to it. OLHS provides Chat Room to both client and lawyer where they can discuss everything. Client and lawyer both can upload and download relevant documents according their case requirements.
      </Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE,
    padding: theme.SIZES.BASE * 2
  }
})

