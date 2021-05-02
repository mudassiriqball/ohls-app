import { useIsFocused } from '@react-navigation/core';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { CaseCard, EasyToast, Loading, NoDataFound } from '../../components';
import getLawyerCases from '../../hooks/getLawyerCases';
import { getBearerTokenFromStorage } from '../../utils/auth';
import urls from '../../utils/urls';

const AssignedCases = (props) => {
  const { user } = props;
  const [reload, setReload] = useState(0);
  const { IS_LOADING, DATA } = getLawyerCases(true, user && user._id, reload);
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

  const handleEndCase = async (item) => {
    setLoading(true);
    let _token = await getBearerTokenFromStorage();
    await axios({
      method: 'PUT',
      url: urls.END_CASE + user._id,
      headers: {
        'authorization': _token
      },
      params: {
        type: item.type,
        details: item.details,
        case_id: item._id,
      }
    }).then(res => {
      setReload(reload + 1);
      setLoading(false);
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
        <CaseCard
          item={item}
          loading={loading}
          user={user}
          from={'AssignedCases'}
          handleEndCase={() => handleEndCase(item)}
        />
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

export default AssignedCases;
