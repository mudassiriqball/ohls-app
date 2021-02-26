import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import theme from '../constants/theme'

export default function CustomButton(props) {
    const { title, disabled, style, textColor, color, mode, small, width, onRight, iconRight } = props;
    return (
        <Button
            mode={mode ? mode : 'contained'}
            style={[
                color ? { backgroundColor: color } : { backgroundColor: theme.COLORS.PRIMARY },
                width ? { width: width } : { width: 'auto' },
                !small && { paddingVertical: 5 },
                onRight && { marginLeft: 'auto' },
                disabled && { opacity: 0.5 },
                { marginTop: 10 }
            ]}
            contentStyle={[
                iconRight && { flexDirection: 'row-reverse' },
            ]}
            labelStyle={[
                { color: textColor ? textColor : theme.COLORS.WHITE },
                disabled && { opacity: 0.7 },
            ]}
            {...props}
        >
            {title}
            {props.children && ' '}
            {props.children && (props.children)}
        </Button>
    )
}

const styles = StyleSheet.create({

})