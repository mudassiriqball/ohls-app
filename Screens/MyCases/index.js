import { useFocusEffect, useIsFocused } from '@react-navigation/core';
import axios from 'axios';
import { UserInterfaceIdiom } from 'expo-constants';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { CaseCard, EasyToast, Loading, NoDataFound } from '../../components';
import getCustomerCases from '../../hooks/getCustomerCases';
import { getBearerTokenFromStorage } from '../../utils/auth';
import urls from '../../utils/urls';

const MyCases = (props) => {
  const { user } = props;
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState();

  const { IS_LOADING, DATA } = getCustomerCases(user && user._id, reload);

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

  // EasyToast
  const toastRef = useRef();
  const [toastType, setToastType] = useState('');
  if (IS_LOADING) {
    return <Loading />
  }

  const handleAcceptOffer = async (item, req_id, assigned_to) => {
    let _token = await getBearerTokenFromStorage();
    setLoading(true);
    await axios({
      method: 'PUT',
      url: urls.ACCEPT_OFFER + item._id,
      headers: {
        'authorization': _token
      },
      params: { req_id, assigned_to }
    }).then(res => {
      setLoading(false);
      setReload(reload + 1);
      setToastType('success');
      toastRef && toastRef.current && toastRef.current.show('Request processed successfully', 2500, () => {
      });
    }).catch(err => {
      console.log('err:', err)
      setLoading(false);
      setToastType('err');
      toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 2500, () => {});
    })
  }
  const handleDeclineOffer = async (item, req_id) => {
    setLoading(true);
    let _token = await getBearerTokenFromStorage();
    await axios({
      method: 'PUT',
      url: urls.DECLINE_OFFER + item._id,
      headers: {
        'authorization': _token
      },
      params: { req_id }
    }).then(res => {
      setReload(reload + 1);
      setLoading(false);
      setToastType('success');
      toastRef && toastRef.current && toastRef.current.show('Request processed successfully', 2500, () => {
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
        <CaseCard
          item={item}
          handleAcceptOffer={(req_id, assigned_to) => handleAcceptOffer(item, req_id, assigned_to)}
          handleDeclineOffer={(req_id) => handleDeclineOffer(item, req_id)}
          loading={loading}
          user={user}
          from='MyCases' />
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

export default MyCases;
