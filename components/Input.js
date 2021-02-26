import React from 'react';
import { View, } from 'react-native';
import { TextInput } from 'react-native-paper';
import theme from '../constants/theme';
import renderError from './renderError';

const Input = (props) => {
    const { error } = props;
    return (
        <View style={{ width: '100%', padding: 0, marginBottom: 5 }}>
            <TextInput
                mode='outlined'
                style={{ fontSize: 14 }}
                theme={{ colors: { primary: theme.COLORS.PRIMARY, background: theme.COLORS.WHITE } }}
                error={error}
                {...props}
            />
            {error !== '' && renderError(error)}
        </View>
    )
}

export default Input;
