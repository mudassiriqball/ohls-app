import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-paper';
import { Button, EasyToast, Input, renderError } from '../../components';
import STYLES from '../../constants/STYLES';
import theme from '../../constants/theme';
import PhoneInput from 'react-native-phone-input'
import axios from 'axios';
import urls from '../../utils/urls';
import { getBearerTokenFromStorage } from '../../utils/auth';
import Navigation from '../../navigation';
import { CommonActions } from '@react-navigation/native';

export default function UpdateProfile(props) {
  const { user, token, isLogged, getUser, navigation } = props;

  const [values, setValues] = useState({
    mobile: user.mobile,
    fullName: user.fullName,
    city: user.city,
    address: user.address,
  });
  const [errors, setErrors] = useState({
    mobile: '',
    fullName: '',
    city: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  // Phone
  const phoneRef = useRef();
  // EasyToast
  const toastRef = useRef();
  const [toastType, setToastType] = useState('');

  const handleUpdate = async () => {
    let mobileErr = '';
    let fullNameErr = '';
    let cityErr = '';
    let addressErr = '';
    let found = false;

    if (values.mobile === '' || !phoneRef.current?.isValidNumber(values.mobile) ||
      values.fullName == '' || values.fullName.length < 5 || values.fullName.length > 30 ||
      values.city === '' || values.city.length < 3 || values.city.length > 30 ||
      values.address === '' || values.address.length < 5 || values.address.length > 30
    ) {
      if (values.mobile === '') {
        found = true;
        mobileErr = 'Required*';
      } else if (!phoneRef.current?.isValidNumber(values.mobile)) {
        found = true;
        mobileErr = 'Invalid mobile!';
      }
      if (values.fullName === '') {
        found = true;
        fullNameErr = 'Required*';
      } else if (values.fullName.length < 5 || values.fullName.length > 30) {
        found = true;
        fullNameErr = 'Value must be 5-30 characters';
      }
      if (values.city === '') {
        found = true;
        cityErr = 'Required*';
      } else if (values.city.length < 3 || values.city.length > 30) {
        found = true;
        cityErr = 'Value must be 3-30 characters';
      }
      if (values.address === '') {
        found = true;
        addressErr = 'Required*';
      } else if (values.address.length < 5 || values.address.length > 30) {
        found = true;
        addressErr = 'Value must be 5-30 characters';
      }
      setErrors({
        mobile: mobileErr,
        fullName: fullNameErr,
        city: cityErr,
        address: addressErr,
      });
      if (found) {
        setToastType('err');
        toastRef && toastRef.current && toastRef.current.show('Fix errors firts !', 500, () => {});
      }
    } else {
      setIsLoading(true);
      let _token = await getBearerTokenFromStorage();

      axios({
        method: 'PUT',
        url: urls.UPDATE_PROFILE + user._id,
        headers: {
          'authorization': _token
        },
        data: values
      }).then(res => {
        setIsLoading(false);
        setToastType('success');
        toastRef && toastRef.current && toastRef.current.show('Profile Updated Sucessfully', 500, () => {
          navigation.dispatch(CommonActions.goBack());
          getUser();
        });
      }).catch(err => {
        console.log('handleUpdate profile err:', err)
        setIsLoading(false);
        setToastType('err');
        toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 1000, () => {});
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
      {/* Mobile */}
      <PhoneInput
        ref={phoneRef}
        value={values.mobile}
        disabled={isLoading}
        defaultValue={values.mobile}
        onChangePhoneNumber={(val) => { setValues({ ...values, mobile: val }), setErrors({ ...errors, mobile: '' }) }}
        style={[STYLES.phoneInput, errors.mobile && { borderColor: theme.COLORS.ERROR, borderWidth: 2 }]}
        flagStyle={{ marginLeft: 10, marginRight: 5 }}
        textStyle={{ marginRight: 20 }}
        allowZeroAfterCountryCode={false}
      />
      {errors.mobile !== '' && renderError(errors.mobile)}

      <Input
        label={'Full Name'}
        placeholder={'Enter Full Name'}
        disabled={isLoading}
        value={values.fullName}
        onChangeText={(val) => { setValues({ ...values, fullName: val }), setErrors({ ...errors, fullName: '' }) }}
        error={errors.fullName}
        left={<TextInput.Icon name='account' color={theme.COLORS.PRIMARY} size={22} />}
      />
      <Input
        label={'City'}
        placeholder={'Enter City'}
        disabled={isLoading}
        value={values.city}
        onChangeText={(val) => { setValues({ ...values, city: val }), setErrors({ ...errors, city: '' }) }}
        error={errors.city}
        left={<TextInput.Icon name='city' color={theme.COLORS.PRIMARY} size={22} />}
      />
      <Input
        label={'Address'}
        placeholder={'Enter Address'}
        disabled={isLoading}
        value={values.address}
        onChangeText={(val) => { setValues({ ...values, address: val }), setErrors({ ...errors, address: '' }) }}
        error={errors.address}
        left={<TextInput.Icon name='location-enter' color={theme.COLORS.PRIMARY} size={22} />}
      />
      <View style={{ flex: 1 }} />
      <Button
        title={'Update Profile'}
        mode={'contained'}
        disabled={isLoading || (values.mobile === user.mobile && values.fullName === user.fullName &&
          values.city === user.city && values.address === user.address)}
        icon='update'
        loading={isLoading}
        onPress={() => handleUpdate()}
      />
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE,
    padding: theme.SIZES.BASE * 2
  }
})

