import { CommonActions } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import { CodeField, useBlurOnFulfill, useClearByFocusCell, Cursor, } from 'react-native-confirmation-code-field';
import { TextInput } from 'react-native-paper';
import { Button, EasyToast, Input, renderError } from '../../components';
import theme from '../../constants/theme';
import Layout from '../../constants/theme/Layout';
import urls from '../../utils/urls';

export default function ChangePassword(props) {
    const { navigation } = props;
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSendCodeLoading, setIsSendCodeLoading] = useState(false);
    const [responseCode, setResponseCode] = useState('');
    const [codeErr, setCodeErr] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passErr, setPassErr] = useState('');
    const [confirmPassErr, setConfirmPassErr] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isVerifyLoading, setIsVerifyLoading] = useState(false);

    // EasyToast
    const toastRef = useRef();
    const [toastType, setToastType] = useState('');

    // Code Input
    const [code, setCode] = useState('');
    const [isCodeSended, setIsCodeSended] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const codeFieldRef = useBlurOnFulfill({ code, cellCount: 6 });
    const [prop, getCellOnLayoutHandler] = useClearByFocusCell({
        code,
        setCode,
    });

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

    // Send Code
    const handleSendCode = () => {
        var emailReg = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailReg.test(username)) {
            setUsernameError('Invalid email!');
            setToastType('err');
            toastRef && toastRef.current && toastRef.current.show('Fix error first !', 1000, () => { });
        } else {
            setIsSendCodeLoading(true);
            axios({
                method: 'GET',
                url: urls.SEND_CODE + (username.toLowerCase().trim()),
            }).then(res => {
                setTimer(59);
                setIsCodeVerified(false);
                setCanResendCode(false);
                setIsCodeSended(true);
                setIsSendCodeLoading(false);
                setResponseCode(res.data.email_code);
                setToastType('success');
                toastRef && toastRef.current && toastRef.current.show('Verification code has been sended to your email.Please check your email', 2000, () => { });
            }).catch(err => {
                setIsSendCodeLoading(false);
                console.log('erre:', err);
                try {
                    if (err.response.status === 400) {
                        setToastType('err');
                        setUsernameError('This email does\'t exist.');
                        toastRef && toastRef.current && toastRef.current.show('This email doesn\'t exist', 1000, () => { });
                    } else {
                        setUsernameError('Something went wrong, Please try again later!');
                        setToastType('err');
                        toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 1000, () => { });
                    }
                } catch (err) {
                    setUsernameError('Something went wrong, Please try again later!');
                    setToastType('err');
                    toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 1000, () => { });
                }
            })
        }
    }

    // Verify Code
    const handleVerifyCode = () => {
        if (code === '' || code.length !== 6) {
            if (code === '')
                setCodeErr('Required*')
            else if (code.length !== 6)
                setCodeErr('Enter 6 digit code')
        } else {
            setIsVerifyLoading(true);
            if (code == responseCode) {
                setIsCodeVerified(true);
            } else {
                setToastType('err');
                setCodeErr('Invalid Code!');
            }
        }
        setIsVerifyLoading(false);
    }

    // Update Password
    const handleUpdatePassword = async () => {
        if (password === '' || confirmPassword === '' || password !== confirmPassword
            || password.length < 8 || password.length > 20 || confirmPassword.length < 8 || confirmPassword.length > 20) {
            let found = false;
            if (password === '') {
                setPassErr('Required*');
                found = true;
            } else if (password.length < 8 || password.length > 20) {
                found = true;
                setPassErr('Value must be 8-20 characters');
            }
            if (confirmPassword === '') {
                found = true;
                setConfirmPassErr('Required*');
            } else if (confirmPassword.length < 8 || confirmPassword.length > 20) {
                found = true;
                setConfirmPassErr('Value must be 8-20 characters');
            }
            if (!found && password !== confirmPassword) {
                setConfirmPassErr('Password shoud match!')
            }
        } else {
            setIsLoading(true);
            axios({
                method: 'PUT',
                url: urls.UPDATE_PASSWORD + (username.toLowerCase().trim()),
                data: { password: password }
            }).then(res => {
                setIsLoading(false);
                setToastType('success');
                toastRef && toastRef.current && toastRef.current.show('Your password updated successfully', 1000, () => {
                    navigation.dispatch(CommonActions.goBack());
                });
            }).catch(err => {
                console.log('pass err:', err)
                setIsLoading(false);
                setToastType('err');
                toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 1000, () => { });
            })
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <EasyToast
                toastRef={toastRef}
                type={toastType}
                position={'top'}
            />
            <View style={{ flex: 1, marginBottom: 'auto' }}>
                <Image source={require('../../assets/images/large_icon.png')} style={styles.logo} />
            </View>
            <View style={{ marginTop: 'auto' }}>
                <Input
                    label={'Email'}
                    placeholder={'Enter your email'}
                    disabled={isSendCodeLoading || isCodeVerified}
                    value={username}
                    onChangeText={(val) => { setUsername(val), setUsernameError('') }}
                    error={usernameError}
                    keyboardType={'email-address'}
                    left={<TextInput.Icon name='email' color={theme.COLORS.PRIMARY} size={20} />}
                />
                {isCodeSended && !isCodeVerified &&
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
                {isCodeVerified &&
                    <>
                        <View style={{ height: 30 }} />
                        {/* Password */}
                        <Input
                            label={'Password'}
                            placeholder={'Enter Password'}
                            value={password}
                            disabled={isLoading}
                            secureTextEntry={showPassword ? false : true}
                            onChangeText={(val) => { setPassword(val), setPassErr('') }}
                            error={passErr}
                            left={<TextInput.Icon name='lock' color={theme.COLORS.PRIMARY} size={22} />}
                            right={<TextInput.Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.COLORS.PRIMARY} onPress={() => setShowPassword(!showPassword)} />}
                        />
                        {/* Confirm Password */}
                        <Input
                            label={'Confirm Password'}
                            placeholder={'Enter Confirm Password'}
                            disabled={isLoading}
                            value={confirmPassword}
                            secureTextEntry={showConfirmPassword ? false : true}
                            onChangeText={(val) => { setConfirmPassword(val), setConfirmPassErr('') }}
                            error={confirmPassErr}
                            left={<TextInput.Icon name='lock' color={theme.COLORS.PRIMARY} size={22} />}
                            right={<TextInput.Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color={theme.COLORS.PRIMARY} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
                        />
                    </>
                }
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    {!isCodeVerified ?
                        isCodeSended ?
                            <>
                                <Button
                                    title={'Resend'}
                                    loading={isSendCodeLoading}
                                    icon='reload'
                                    disabled={username === '' || isSendCodeLoading || !canResendCode}
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
                                    loading={isVerifyLoading}
                                    disabled={isVerifyLoading}
                                    width={'48%'}
                                    icon='check'
                                    onPress={() => handleVerifyCode()}
                                />
                            </>
                            :
                            <Button
                                title={'Send Code'}
                                loading={isSendCodeLoading}
                                disabled={username === '' || isSendCodeLoading}
                                icon='send'
                                onRight
                                width={'100%'}
                                onPress={() => handleSendCode()}
                            />
                        :
                        <Button
                            title={'Continue'}
                            loading={isLoading}
                            disabled={password === '' || confirmPassword === '' || isLoading}
                            icon='send'
                            onRight
                            width={'100%'}
                            onPress={() => handleUpdatePassword()}
                        />
                    }
                </View>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: theme.COLORS.WHITE,
        padding: theme.SIZES.BASE * 2
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginVertical: 10,
    },
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

