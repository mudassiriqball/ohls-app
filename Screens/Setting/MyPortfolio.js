import { CommonActions } from '@react-navigation/routers';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, TextInput } from 'react-native'
import { Button, EasyToast } from '../../components';
import theme from '../../constants/theme'
import { getBearerTokenFromStorage } from '../../utils/auth';
import urls from '../../utils/urls';

export default function MyPortfolio(props) {
  const { user, getUser, navigation } = props;

  const [val, setVal] = useState('');
  const [err, setErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // EasyToast
  const toastRef = useRef();
  const [toastType, setToastType] = useState('');

  useEffect(() => {
    setVal(user && user.portfolio);
    return () => {
    }
  }, [])

  const handleUpdate = async () => {
    setIsLoading(true);
    let _token = await getBearerTokenFromStorage();
    await axios({
      method: 'PUT',
      url: urls.UPDATE_PROFILE + user._id,
      headers: {
        'authorization': _token
      },
      data: { portfolio: val }
    }).then(res => {
      setIsLoading(false);
      setToastType('success');
      toastRef && toastRef.current && toastRef.current.show('Portfolio Updated Sucessfully', 500, () => {
        navigation.dispatch(CommonActions.goBack());
        getUser();
      });
    }).catch(err => {
      console.log('handleUpdate err:', err)
      setIsLoading(false);
      setToastType('err');
      toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 500, () => {});
    })
  }
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: theme.SIZES.BASE * 2 }} showsVerticalScrollIndicator={false}>
      <EasyToast
        toastRef={toastRef}
        type={toastType}
        position={'top'}
      />
      <Text style={[styles.text, { textAlign: 'center', marginVertical: 20 }]}>This is your Portfolio and  will be shown on your profile</Text>
      <TextInput
        value={val}
        multiline={true}
        numberOfLines={30}
        style={{ borderColor: theme.COLORS.LIGHT_GRAY, borderWidth: 1, padding: 5, borderRadius: 3 }}
        textAlignVertical='top'
        placeholder={'Type your experience, milestones, etc.'}
        onChangeText={(val) => { setVal(val), setErr('') }}
        error={err}
      />
      <View style={{ flex: 1, height: 20 }} />
      <Button
        title={'Update'}
        mode={'contained'}
        disabled={isLoading || val === ''}
        icon='update'
        loading={isLoading}
        onPress={() => handleUpdate()}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  text: {
    color: theme.COLORS.TEXT,
  }
})
