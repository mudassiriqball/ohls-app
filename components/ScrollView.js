import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import theme from '../constants/theme';

export default function Scrollview(props) {
    const { style, padding } = props;

    return (
        <ScrollView
            contentContainerStyle={[styles.container, style, { padding: padding ? (theme.SIZES.BASE * padding) : 0 }]}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        >
            {props.children}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: colors => ({
        flexGrow: 1,
        backgroundColor: theme.COLORS.WHITE,
    })
})
