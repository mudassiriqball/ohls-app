import React from 'react'
import { View, Text } from 'react-native'
import theme from '../constants/theme'

export default function NoDataFound() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
            <Text style={{ color: theme.COLORS.LIGHT_BLACK }}>{'No Data Found'}</Text>
        </View>
    )
}
