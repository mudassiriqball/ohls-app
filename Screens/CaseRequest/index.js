import { useIsFocused } from '@react-navigation/core';
import axios from 'axios';
import { UserInterfaceIdiom } from 'expo-constants';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { CaseCard, EasyToast, Loading, NoDataFound } from '../../components';
import getAllCases from '../../hooks/getAllCases';
import { getBearerTokenFromStorage } from '../../utils/auth';
import urls from '../../utils/urls';

const CaseRequest = (props) => {
  const { user } = props;
  const [reload, setReload] = useState();
  const { IS_LOADING, DATA } = getAllCases(false, reload);
  const [loading, setLoading] = useState();

  // EasyToast
  const toastRef = useRef();
  const [toastType, setToastType] = useState('');

  // Refresh Pull Down
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setReload(reload + 1);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    setReload(reload + 1);
    return () => {
    };
  }, [isFocused]);

  if (IS_LOADING) {
    return <Loading />
  }

  const handleSendOffer = async (item) => {
    let _token = await getBearerTokenFromStorage();
    await axios({
      method: 'PUT',
      url: urls.SEND_OFFER + item._id,
      headers: {
        'authorization': _token
      },
      data: { lawyer_id: user._id, entry_date: new Date() }
    }).then(res => {
      setLoading(false);
      setReload(reload + 1);
      setToastType('success');
      toastRef && toastRef.current && toastRef.current.show('Portfolio Updated Successfully', 2500, () => {
      });
    }).catch(err => {
      console.log('err:', err)
      setLoading(false);
      setToastType('err');
      toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 2500, () => {});
    })
  }

  function renderItem({ item }) {
    return (
      <View style={{ padding: 5, width: '100%' }}>
        <CaseCard item={item} onPress={() => handleSendOffer(item)} loading={loading} user={user} />
      </View>
    )
  }

  return (
    <>
      <EasyToast
        toastRef={toastRef}
        type={toastType}
        position={'top'}
      />
      {DATA && DATA.length > 0 ?
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          numColumns={1}
          initialNumToRender={3}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
        :
        <NoDataFound />
      }
    </>
  )
}

export default CaseRequest;
