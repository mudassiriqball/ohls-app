import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Platform, Text, TextInput, View } from 'react-native';
import { Button, EasyToast, Input, renderError } from '../../components';
import ScrollView from '../../components/ScrollView';
import STYLES from '../../constants/STYLES';
import theme from '../../constants/theme';
import { getBearerTokenFromStorage } from '../../utils/auth';
import urls from '../../utils/urls';

const HireLawyer = props => {
  const { token, user } = props;
  const [type, setType] = useState('');
  const [typeError, setTypeError] = useState('');
  const [details, setDetails] = useState('');
  const [detailsError, setDetailsError] = useState('');
  const [loading, setLoading] = useState(false);

  // EasyToast
  const toastRef = useRef();
  const [toastType, setToastType] = useState('');


  const handlePostCase = async () => {
    let _token = await getBearerTokenFromStorage();
    if (type === '' || details === '') {
      if (type === '') {
        setTypeError('Required*');
      }
      if (details === '') {
        setDetailsError('Required*');
      }
    } else {
      setLoading(true);
      await axios({
        method: 'POST',
        url: urls.POST_CASE + user._id,
        headers: {
          'authorization': _token
        },
        data: {
          type,
          details,
        }
      }).then(res => {
        setToastType('success');
        toastRef && toastRef.current && toastRef.current.show('Request processed successfully!', 2500, () => {
          setLoading(false);
        });
        setType('');
        setTypeError('');
        setDetails('');
        setDetailsError('');
      }).catch(err => {
        console.log('handlePostCase err:', err);
        setToastType('err');
        toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 2500, () => {
          setLoading(false);
        });
      })
    }
  }

  return (
    <ScrollView padding={1}>
      <EasyToast
        toastRef={toastRef}
        type={toastType}
        position={'top'}
      />
      {/* Case Type */}
      <Text style={{ marginBottom: 5 }}>{'Case Type'}</Text>
      <View style={[Platform.OS === "ios" ? STYLES.iosPickerContainer : STYLES.androidPickerContainer,
      { borderColor: typeError !== '' ? theme.COLORS.ERROR : theme.COLORS.GRAY, borderWidth: typeError !== '' ? 2 : 1 }
      ]}>
        <Picker
          selectedValue={type}
          style={STYLES.picker}
          onValueChange={(itemValue, itemIndex) => { setType(itemValue), setTypeError('') }}>
          <Picker.Item label="Select Case Type" value="" />
          <Picker.Item label="Criminal Case" value="Criminal Case" />
          <Picker.Item label="Civil Case" value="Civil Case" />
          <Picker.Item label="Family Case" value="Family Case" />
          <Picker.Item label="Property Case" value="Property Case" />
        </Picker>
      </View>
      {detailsError !== '' &&
        <View style={{ marginTop: -6 }}>
          {renderError(typeError)}
        </View>
      }
      {/* Details */}
      <Text style={{ marginBottom: 5, marginTop: 10 }}>{'Case Details'}</Text>
      <TextInput
        value={details}
        multiline={true}
        numberOfLines={30}
        style={{ borderColor: detailsError ? theme.COLORS.ERROR : theme.COLORS.GRAY, borderWidth: 1, padding: 10, borderRadius: 3, backgroundColor: 'white' }}
        textAlignVertical='top'
        placeholder={'Type your case details here.'}
        onChangeText={(val) => { setDetails(val), setDetailsError('') }}
        error={detailsError}
      />
      {detailsError !== '' &&
        <View style={{ marginTop: 2 }}>
          {renderError(detailsError)}
        </View>
      }
      <View style={{ height: 20 }} />
      <Button
        title={'Post Case'}
        uppercase={false}
        loading={loading}
        disabled={loading}
        onPress={() => handlePostCase()}
      />
    </ScrollView>
  )
}

export default HireLawyer;
