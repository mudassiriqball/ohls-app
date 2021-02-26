import React from 'react'
import Toast from 'react-native-easy-toast'
import theme from '../../constants/theme';

export default function EasyToast(props) {
    const { toastRef, type, position, } = props;
    return (
        <Toast
            ref={toastRef}
            style={{
                minWidth: '50%',
                maxWidth: '90%',
                padding: 15,
                backgroundColor: type === 'success' ?
                    theme.COLORS.SUCCESS
                    :
                    type === 'err' ?
                        theme.COLORS.ERROR
                        :
                        type === 'warn' ?
                            theme.COLORS.WARNING
                            :
                            theme.COLORS.BLACK
            }}
            position={position ? position : "center"}
            positionValue={200}
            fadeInDuration={500}
            fadeOutDuration={1000}
            opacity={0.9}
            textStyle={{ color: "white", textAlign: 'center' }}
        />
    )
}
