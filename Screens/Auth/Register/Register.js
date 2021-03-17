import React, { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-paper';
import { Formik } from "formik";
import * as yup from "yup";

import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import Input from '../../../components/Input';
import theme from '../../../constants/theme';
import Layout from '../../../constants/theme/Layout';
import Button from '../../../components/Button';
import STATUSBAR_HEIGHT from '../../../components/StatusBarHeight';
import GeneralInfo from './GeneralInfo';
import EasyToast from '../../../components/Toasts/EasyToast';
import PersonalInfo from './PersonalInfo';
import RegisterReview from './RegisterReview';
import urls from '../../../utils/urls';
import axios from 'axios';
import SocialLogin from '../../../components/SocialLogin';

const schema = yup.object({
    username: yup.string().email('Invalid email')
        .required('Required*')
        .max(100, 'Can\'t be grater than 180 characters'),
    mobile: yup.string().required('Required*'),
    fullName: yup.string().required('Required*')
        .min(5, 'Enter 5-30 characters')
        .max(30, 'Enter 5-30 characters'),
    licenseNo: yup.string(),
    password: yup.string().required('Required*')
        .min(8, 'Enter 8-20 characters')
        .max(20, 'Enter 8-20 characters'),
    confirm_password: yup.string().required('Required*').when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf(
            [yup.ref("password")],
            'Password must match'
        )
    }),
    city: yup.string().required('Required*')
        .min(3, 'Enter 3-30 characters')
        .max(30, 'Enter 3-30 characters'),
    avatar: yup.string(),
    gender: yup.string().required('Required*'),
    address: yup.string().required('Required*')
        .min(5, 'Enter 5-200 characters')
        .max(200, 'Enter 5-200 characters'),
    role: yup.string().required('Required*'),
});

export default function Register(props) {
    const { getUser, navigation } = props;

    const [isSocial, setIsSocial] = useState(false);
    const [type, setType] = useState('');
    const [userData, setUserData] = useState('');
    const [step, setSteps] = useState(1);
    const [isCodeSended, setIsCodeSended] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false);

    // Phone
    const phoneRef = useRef();
    const [phone, setPhone] = useState("");

    // EasyToast
    const toastRef = useRef();
    const [toastType, setToastType] = useState('');

    useEffect(() => {
        try {
            if (props && props.route && props.route.params && props.route.params) {
                setIsSocial(true);
                setUserData(props.route.params.user);
                setIsCodeSended(true);
                setIsCodeVerified(true);
                setType(props.route.params.type)
            }
        } catch (err) {
        }
        return () => {
        }
    }, []);

    const handleStepForword = (values, errors, setFieldError, touched, setTouched) => {
        if (step === 1) {
            setTouched({
                ['username']: true, ['fullName']: true, ['mobile']: true
            });
            if (!phoneRef.current?.isValidNumber(phoneRef.current?.getNumberAfterPossiblyEliminatingZero().formattedNumber)) {
                setFieldError('mobile', 'Invalid Phone!');
                setToastType('err');
                toastRef && toastRef.current && toastRef.current.show('Fix errors firts !', 1000, () => { });
            } else if (!errors.username && !errors.fullName && !errors.mobile) {
                setSteps(2);
            } else {
                setToastType('err');
                toastRef && toastRef.current && toastRef.current.show('Fix errors firts !', 1000, () => { });
            }
        } else if (step === 2) {
            setTouched({
                ['gender']: true, ['city']: true, ['address']: true, ['licenseNo']: true,
                ['password']: true, ['confirm_password']: true, ['role']: true,
            });
            if (values.role === 'lawyer' && values.licenseNo === '') {
                setFieldError('licenseNo', 'Required*');
            } else if (!errors.gender && !errors.city && !errors.address && !errors.password && !errors.confirm_password) {
                setSteps(3);
            } else {
                setToastType('err');
                toastRef && toastRef.current && toastRef.current.show('Fix errors firts !', 1000, () => { });
            }
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.background} />
            <Formik
                initialValues={{
                    mobile: '',
                    fullName: isSocial ? userData.name : '',
                    username: isSocial ? userData.email : '',
                    password: isSocial ? '1234567890' : '',
                    confirm_password: isSocial ? '1234567890' : '',
                    city: '',
                    role: 'customer',
                    address: '',
                    gender: '',
                    licenseNo: '',
                    licenseNo: '',
                    avatar: '',
                }}
                validationSchema={schema}
                onSubmit={(values, actions) => {
                    values.username = values.username.toLowerCase().trim();
                    axios({
                        method: 'POST',
                        url: urls.REGISTER,
                        data: values
                    }).then(res => {
                        setToastType('success');
                        toastRef && toastRef.current && toastRef.current.show('Congragulations your account created successfully!', 1000, () => {
                            props.navigation.navigate('Login');
                        });
                    }).catch(err => {
                        console.log('register err:', err);
                        setToastType('err');
                        toastRef && toastRef.current && toastRef.current.show('Something wents wront, Please try again later!', 1000, () => { });
                    }).finally(() => {
                        actions.setSubmitting(false);
                    })
                }}
            >
                {({
                    values,
                    touched,
                    errors,
                    isSubmitting,
                    handleSubmit,
                    handleChange,
                    setSubmitting,
                    setFieldValue,
                    setFieldError,
                    handleBlur,
                    setTouched,
                }) => {
                    return (
                        <View style={styles.loginContainer}>
                            <EasyToast
                                toastRef={toastRef}
                                type={toastType}
                                position={'top'}
                            />
                            <Image source={require('../../../assets/images/large_icon.png')} style={styles.logo} />

                            {/* Steps Container */}
                            <View style={styles.setpContainer}>
                                <View style={styles.stepInerContainer}>
                                    <View style={[styles.step, step >= 1 && { backgroundColor: theme.COLORS.PRIMARY }]}>
                                        {step > 1 ?
                                            <Entypo name="check" size={20} color={theme.COLORS.WHITE} />
                                            :
                                            <Text style={[{ fontSize: 20, color: step === 1 ? theme.COLORS.WHITE : theme.COLORS.PRIMARY }]}>{1}</Text>
                                        }
                                    </View>
                                    <Text style={styles.stepText}>General</Text>
                                </View>
                                <View style={styles.stepInerContainer}>
                                    <View style={[styles.step, step >= 2 && { backgroundColor: theme.COLORS.PRIMARY }]}>
                                        {step > 2 ?
                                            <Entypo name="check" size={20} color={theme.COLORS.WHITE} />
                                            :
                                            <Text style={[{ fontSize: 20, color: step === 2 ? theme.COLORS.WHITE : theme.COLORS.PRIMARY }]}>{2}</Text>
                                        }
                                    </View>
                                    <Text style={styles.stepText}>Personel</Text>
                                </View>
                                <View style={styles.stepInerContainer}>
                                    <View style={[styles.step, step === 3 && { backgroundColor: theme.COLORS.PRIMARY }]}>
                                        {step > 3 ?
                                            <Entypo name="check" size={20} color={theme.COLORS.WHITE} />
                                            :
                                            <Text style={[{ fontSize: 20, color: step === 3 ? theme.COLORS.WHITE : theme.COLORS.PRIMARY }]}>{3}</Text>
                                        }
                                    </View>
                                    <Text style={styles.stepText}>Review</Text>
                                </View>
                            </View>

                            {step === 1 ?
                                <>
                                    {!isSocial ?
                                        <SocialLogin
                                            navigation={navigation}
                                            setIsLoading={setSubmitting}
                                            isLoading={isSubmitting}
                                            getUser={getUser}
                                        />
                                        :
                                        <View style={{ height: 40 }} />
                                    }
                                    <GeneralInfo
                                        isSocial={isSocial}
                                        type={type}
                                        userData={userData}
                                        values={values}
                                        handleChange={handleChange}
                                        touched={touched}
                                        setFieldValue={setFieldValue}
                                        handleBlur={handleBlur}
                                        errors={errors}
                                        setFieldError={setFieldError}
                                        isCodeSended={isCodeSended}
                                        setIsCodeSended={setIsCodeSended}
                                        isCodeVerified={isCodeVerified}
                                        setIsCodeVerified={setIsCodeVerified}
                                        toastRef={toastRef}
                                        setToastType={setToastType}
                                        phoneRef={phoneRef}
                                        phone={phone}
                                        setPhone={setPhone}
                                    />
                                    <View style={styles.login}>
                                        <Text style={styles.text}>Already have an account ?</Text>
                                        <TouchableOpacity onPress={() => props.navigation.navigate('Login')} style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={[styles.text, { color: theme.COLORS.LINK }]}> Login</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                                :
                                step === 2 ?
                                    <>
                                        <PersonalInfo
                                            isSocial={isSocial}
                                            type={type}
                                            userData={userData}
                                            values={values}
                                            handleChange={handleChange}
                                            touched={touched}
                                            handleBlur={handleBlur}
                                            setFieldValue={setFieldValue}
                                            errors={errors}
                                            setFieldError={setFieldError}
                                            isCodeSended={isCodeSended}
                                            setIsCodeSended={setIsCodeSended}
                                            isCodeVerified={isCodeVerified}
                                            setIsCodeVerified={setIsCodeVerified}
                                            toastRef={toastRef}
                                            setToastType={setToastType}
                                        />
                                    </>
                                    :
                                    <>
                                        <RegisterReview
                                            isSocial={isSocial}
                                            type={type}
                                            userData={userData}
                                            values={values}
                                            handleRegister={handleSubmit}
                                            isSubmitting={isSubmitting}
                                        />
                                    </>
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                {step > 1 &&
                                    <Button
                                        title={'Back'}
                                        icon='arrow-left'
                                        color={theme.COLORS.PRIMARY}
                                        textColor={theme.COLORS.WHITE}
                                        width={'40%'}
                                        onPress={() => setSteps(step - 1)}
                                        disabled={isSubmitting}
                                    />
                                }
                                {step < 3 &&
                                    <Button
                                        title={'Next'}
                                        icon='arrow-right'
                                        color={theme.COLORS.RED}
                                        textColor={theme.COLORS.WHITE}
                                        disabled={!isCodeVerified || isSubmitting}
                                        iconRight
                                        width={'40%'}
                                        onRight
                                        onPress={() => handleStepForword(values, errors, setFieldError, touched, setTouched)}
                                    />
                                }
                            </View>
                        </View>
                    )
                }}
            </Formik>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: theme.COLORS.WHITE,
    },
    background: {
        position: 'absolute',
        width: Layout.window.width,
        height: Layout.window.height / 2,
        backgroundColor: theme.COLORS.PRIMARY,
    },

    // Step
    setpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    stepInerContainer: {
        marginHorizontal: 20,
        flexDirection: 'column',
        alignItems: 'center'
    },
    stepText: {
        color: theme.COLORS.GRAY
    },
    step: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.COLORS.WHITE,
        borderColor: theme.COLORS.PRIMARY,
        borderWidth: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },

    // Login
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginVertical: 10,
    },
    loginContainer: {
        flex: 1,
        marginTop: STATUSBAR_HEIGHT,
        backgroundColor: theme.COLORS.WHITE,
        margin: theme.SIZES.BASE,
        paddingHorizontal: theme.SIZES.BASE,
        paddingBottom: theme.SIZES.BASE * 3,
        shadowColor: theme.COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        borderRadius: 5,
        elevation: 3,
    },
    forgot_password: {
        marginLeft: 'auto',
        marginVertical: 20,
    },
    // Register
    login: {
        alignSelf: 'center',
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        fontSize: 12,
        color: theme.COLORS.GRAY,
        marginBottom: 5,
    },

    // Social
    social: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    registerUsing: {
        fontSize: 14,
        color: theme.COLORS.GRAY,
        marginVertical: 15,
        textAlign: 'center'
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.COLORS.GOOGLE,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

