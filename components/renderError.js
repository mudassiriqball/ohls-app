import React from 'react'
import { Text } from 'react-native'
import theme from '../constants/theme'

export default function renderError(error) {
    return (
        <Text style={{ color: theme.COLORS.ERROR, fontSize: theme.SIZES.ERROR }}>
            {error}
        </Text>
    )
}
