import React, { useRef, useState, useEffect } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { Switch, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

import { Input, renderError } from '../../../components';
import theme from '../../../constants/theme';
import STYLES from '../../../constants/STYLES';

export default function PersonalInfo(props) {
    const {
        isSocial, userData, values, handleChange, errors, setFieldError, touched, handleBlur, setFieldValue,
        isCodeSended, setIsCodeSended,
        isCodeVerified, setIsCodeVerified,
        toastRef,
        setToastType
    } = props;

    useEffect(() => {
        if (isSocial && values.password === '') {
            setFieldValue('password', '1234567890');
            setFieldValue('confirm_password', '1234567890');
        }
        return () => {
        }
    }, [isSocial]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Switch
    const [isLawyer, setIsLawyer] = useState(false);
    const onToggleLayerSwitch = (e) => {
        setIsLawyer(e);
        if (e) {
            setFieldValue('role', 'lawyer');
        } else {
            setFieldValue('role', 'customer');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.switchContainer}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.COLORS.GRAY }}>Register as Lawyer</Text>
                <Switch value={isLawyer} color={theme.COLORS.PRIMARY} onValueChange={(e) => onToggleLayerSwitch(e)} />
            </View>

            {/* Gender */}
            <View style={[Platform.OS === "ios" ? STYLES.iosPickerContainer : STYLES.androidPickerContainer,
            { borderColor: (errors.gender && touched.gender) ? theme.COLORS.ERROR : theme.COLORS.GRAY, borderWidth: (errors.gender && touched.gender) ? 2 : 1 }
            ]}>
                <Picker
                    selectedValue={values.gender}
                    style={STYLES.picker}
                    onBlur={handleBlur('gender')}
                    onValueChange={(itemValue, itemIndex) =>
                        setFieldValue('gender', itemValue)
                    }>
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="Other" />
                </Picker>
            </View>
            <View style={{ marginTop: -6 }}>
                {(errors.gender && touched.gender) && renderError(errors.gender)}
            </View>

            {/* City */}
            <Input
                label={'City'}
                placeholder={'Enter City'}
                value={values.city}
                onChangeText={handleChange('city')}
                error={(touched.city && errors.city) ? errors.city : ''}
                onBlur={handleBlur('city')}
                left={<TextInput.Icon name='city' color={theme.COLORS.PRIMARY} size={22} />}
            />

            {/* Adress */}
            <Input
                label={'Address'}
                placeholder={'Enter Address'}
                value={values.address}
                onChangeText={handleChange('address')}
                error={(touched.address && errors.address) ? errors.address : ''}
                onBlur={handleBlur('address')}
                left={<TextInput.Icon name='location-enter' color={theme.COLORS.PRIMARY} size={22} />}
            />

            {/* Lisence */}
            {values.role === 'lawyer' && <Input
                label={'Lisence Number'}
                placeholder={'Enter Lisence Number'}
                value={values.licenseNo}
                onChangeText={handleChange('licenseNo')}
                error={(touched.licenseNo && errors.licenseNo) ? errors.licenseNo : ''}
                onBlur={handleBlur('licenseNo')}
                left={<TextInput.Icon name='code-tags' color={theme.COLORS.PRIMARY} size={22} />}
            />}

            {!isSocial &&
                <>
                    <View style={{ height: 30 }} />
                    {/* Password */}
                    <Input
                        label={'Password'}
                        placeholder={'Enter Password'}
                        value={values.password}
                        secureTextEntry={showPassword ? false : true}
                        onChangeText={handleChange('password')}
                        error={(touched.password && errors.password) ? errors.password : ''}
                        onBlur={handleBlur('password')}
                        left={<TextInput.Icon name='lock' color={theme.COLORS.PRIMARY} size={22} />}
                        right={<TextInput.Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.COLORS.PRIMARY} onPress={() => setShowPassword(!showPassword)} />}
                    />
                    {/* Confirm Password */}
                    <Input
                        label={'Confirm Password'}
                        placeholder={'Enter Confirm Password'}
                        value={values.confirm_password}
                        secureTextEntry={showConfirmPassword ? false : true}
                        onChangeText={handleChange('confirm_password')}
                        error={(touched.confirm_password && errors.confirm_password) ? errors.confirm_password : ''}
                        onBlur={handleBlur('confirm_password')}
                        left={<TextInput.Icon name='lock' color={theme.COLORS.PRIMARY} size={22} />}
                        right={<TextInput.Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color={theme.COLORS.PRIMARY} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
                    />
                </>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 30,
    },

    // Switch
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 15,
        alignItems: 'center'
    },
})

