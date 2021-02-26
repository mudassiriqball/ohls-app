import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import theme from '../constants/theme'

export default function Loading() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
            <ActivityIndicator size="large" color={theme.COLORS.PRIMARY} />
        </View>
    )
}
