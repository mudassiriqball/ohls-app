import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PhoneInput from 'react-native-phone-number-input';
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import { Input, Button, renderError } from '../../../components';
import theme from '../../../constants/theme';
import urls from '../../../utils/urls';
import STYLES from '../../../constants/STYLES';

export default function GeneralInfo(props) {
    const {
        isSocial, type, userData, values, handleChange, errors, setFieldError, touched, handleBlur, setFieldValue,
        isCodeSended, setIsCodeSended, phoneRef,
        isCodeVerified, setIsCodeVerified,
        toastRef, setToastType, setPhone, phone
    } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifyLoading, setIsVerifyLoading] = useState(false);
    const [code, setCode] = useState('');
    const [responseCode, setResponseCode] = useState('');
    const [codeErr, setCodeErr] = useState('');
    const [prevEmail, setPrevEmail] = useState('');

    // Timer
    const [timer, setTimer] = useState(59);
    const [canResendCode, setCanResendCode] = useState(false);
    useEffect(() => {
        let interval = setInterval(() => {
            if (timer > 0) {
                setTimer(timer - 1);
            } else if (timer === 0) {
                setCanResendCode(true);
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [timer]);

    useEffect(() => {
        if (isSocial) {
            setFieldValue('username', userData.email);
            setFieldValue('fullName', userData.name);
            if (type === 'google')
                setFieldValue('avatar', userData.photoUrl);
        }
        return () => {
        }
    }, [userData])


    // PhoneInput
    const handlePhoneChange = () => {
        setFieldValue('mobile', phoneRef.current?.getNumberAfterPossiblyEliminatingZero().formattedNumber);
    }

    // Code Input
    const codeFieldRef = useBlurOnFulfill({ code, cellCount: 6 });
    const [prop, getCellOnLayoutHandler] = useClearByFocusCell({
        code,
        setCode,
    });

    // Send Code
    const handleSendCode = () => {
        if (errors.username) {
            setToastType('err');
            toastRef && toastRef.current && toastRef.current.show('Fix error first !', 1000, () => { });
        } else {
            setIsLoading(true);
            axios({
                method: 'GET',
                url: urls.VERIFY_USER_NAME + values.username,
            }).then(res => {
                setTimer(59);
                setCanResendCode(false);
                setIsCodeSended(true);
                setIsLoading(false);
                setResponseCode(res.data.email_code);
                setToastType('success');
                toastRef && toastRef.current && toastRef.current.show('Verification code has been sended to your email.Please check your email', 2000, () => { });
            }).catch(err => {
                setIsLoading(false);
                if (err.response.status === 409) {
                    setToastType('err');
                    setFieldError('username', 'This email already exist.')
                    toastRef && toastRef.current && toastRef.current.show('This email already exists', 1000, () => { });
                } else if (err.response.status === 400) {
                    setToastType('err');
                    setFieldError('username', 'This email does\'t exist.')
                    toastRef && toastRef.current && toastRef.current.show('This email doesn\'t exist, Or something went wrong', 1000, () => { });
                } else {
                    setToastType('err');
                    toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 1000, () => { });
                }
            })
        }
    }

    // Verify Code
    const handleVerifyCode = () => {
        if (code === '' || code.length !== 6) {
            if (values.username === '')
                setFieldError('username', 'Required*')
            if (code === '')
                setCodeErr('Required*')
            else if (code.length !== 6)
                setCodeErr('Enter 6 digit code')
        } else {
            setIsVerifyLoading(true);
            if (code == responseCode) {
                setIsCodeVerified(true);
                setPrevEmail(values.username);
            } else {
                setToastType('err');
                setCodeErr('Invalid Code!');
            }
        }
        setIsVerifyLoading(false);
    }

    return (
        <View style={styles.conatiner}>
            {!isSocial && <Text style={styles.registerUsing}>Register Using OLHS</Text>}
            <Input
                label={'Email'}
                placeholder={'Enter your email'}
                value={values.username}
                onChangeText={(val) => {
                    setFieldValue('username', val);
                    values.username !== prevEmail && (setIsCodeSended(false), setIsCodeVerified(false));
                }}
                disabled={isSocial}
                error={(touched.username && errors.username) ? errors.username : ''}
                onBlur={handleBlur('username')}
                keyboardType={'email-address'}
                left={<TextInput.Icon name='email' color={theme.COLORS.PRIMARY} size={20} />}
                editable={!isCodeVerified}
            />
            {/* Full Name */}
            <Input
                label={'Full Name'}
                placeholder={'Enter Full Name'}
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                error={(touched.fullName && errors.fullName) ? errors.fullName : ''}
                onBlur={handleBlur('fullName')}
                left={<TextInput.Icon name='account' color={theme.COLORS.PRIMARY} size={22} />}
            />
            {/* Mobile */}
            <PhoneInput
                ref={phoneRef}
                defaultValue={phone}
                defaultCode="PK"
                layout="first"
                onChangeText={(text) => setPhone(text)}
                onChangeFormattedText={(text) => handlePhoneChange(text)}
                containerStyle={[STYLES.phoneInput, (errors.mobile && touched.mobile) && { borderColor: theme.COLORS.ERROR, borderWidth: 2 }]}
            />
            {(errors.mobile && touched.mobile) && renderError(errors.mobile)}
            {/* Code Input */}
            {!isSocial && !isCodeVerified &&
                <>
                    {isCodeSended &&
                        <>
                            <CodeField
                                ref={codeFieldRef}
                                value={code}
                                onChangeText={(val) => { setCode(val), setCodeErr('') }}
                                cellCount={6}
                                rootStyle={[styles.codeFieldRoot, codeErr && { borderColor: theme.COLORS.ERROR, borderWidth: 2 }]}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                renderCell={({ index, symbol, isFocused }) => (
                                    <Text
                                        key={index}
                                        style={[styles.cell, isFocused && styles.focusCell]}
                                        onLayout={getCellOnLayoutHandler(index)}>
                                        {symbol || (isFocused ? <Cursor /> : null)}
                                    </Text>
                                )}
                            />
                            {codeErr !== '' && renderError(codeErr)}
                        </>
                    }
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        {isCodeSended ?
                            <>
                                <Button
                                    title={'Resend'}
                                    loading={isLoading}
                                    icon='reload'
                                    disabled={values.username === '' || isLoading || !canResendCode}
                                    width={'48%'}
                                    color={theme.COLORS.RED}
                                    onPress={() => handleSendCode()}
                                >
                                    {timer > 0 && (
                                        <Text style={{}}>
                                            {(timer > 9 ? "00:" : "00:0") + timer}
                                        </Text>
                                    )}
                                </Button>
                                <Button
                                    title={'Verify'}
                                    width={'48%'}
                                    loading={isVerifyLoading}
                                    icon='check'
                                    onPress={() => handleVerifyCode()}
                                />
                            </>
                            :
                            <Button
                                title={'Send Code'}
                                loading={isLoading}
                                disabled={values.username === '' || isLoading}
                                icon='send'
                                onRight
                                width={'100%'}
                                onPress={() => handleSendCode()}
                            />
                        }
                    </View>
                </>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        marginBottom: 30,
    },
    registerUsing: {
        fontSize: 14,
        color: theme.COLORS.GRAY,
        marginVertical: 15,
        textAlign: 'center'
    },
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: {
        marginTop: 8,
        borderColor: theme.COLORS.GRAY,
        borderWidth: 1,
        borderRadius: 4,
        height: 57,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: '#00000030',
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#000',
    },
})

