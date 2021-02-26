import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import theme from '../constants/theme';

export default function AboutUs() {
    return (
        <View style={styles.container}>
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

