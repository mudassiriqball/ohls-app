import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { Button, Input } from '../../../components';
import theme from '../../../constants/theme';

export default function RegisterReview(props) {
    const { isSocial, userData, values, handleRegister, isSubmitting } = props;
    const [showPassword, setShowPassword] = useState(false);
    return (
        <View style={styles.container}>
            <Input
                label={'Email'}
                error={''}
                editable={false}
                value={values.username}
                left={<TextInput.Icon name='email' color={theme.COLORS.PRIMARY} size={22} />}
            />
            <Input
                label={'Full Name'}
                editable={false}
                error={''}
                value={values.fullName}
                left={<TextInput.Icon name='account' color={theme.COLORS.PRIMARY} size={22} />}
            />
            <Input
                label={'Mobile'}
                editable={false}
                error={''}
                value={values.mobile}
                left={<TextInput.Icon name='phone' color={theme.COLORS.PRIMARY} size={22} />}
            />
            <Input
                label={'Gender'}
                editable={false}
                error={''}
                value={values.gender}
                left={<TextInput.Icon name='gender-male-female' color={theme.COLORS.PRIMARY} size={22} />}
            />
            <Input
                label={'City'}
                value={values.city}
                editable={false}
                error={''}
                left={<TextInput.Icon name='city' color={theme.COLORS.PRIMARY} size={22} />}
            />
            <Input
                label={'Address'}
                editable={false}
                error={''}
                value={values.address}
                left={<TextInput.Icon name='location-enter' color={theme.COLORS.PRIMARY} size={22} />}
            />
            {!isSocial && <Input
                label={'Password'}
                value={values.password}
                editable={false}
                error={''}
                secureTextEntry={showPassword ? false : true}
                left={<TextInput.Icon name='city' color={theme.COLORS.PRIMARY} size={22} />}
                right={<TextInput.Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.COLORS.PRIMARY} onPress={() => setShowPassword(!showPassword)} />}
            />}
            <View style={{ height: 30 }} />
            <Button
                title={'Register'}
                mode={'contained'}
                icon='login'
                loading={isSubmitting}
                disabled={isSubmitting}
                onPress={() => handleRegister()}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        marginVertical: 30,
        flex: 1
    }
})

