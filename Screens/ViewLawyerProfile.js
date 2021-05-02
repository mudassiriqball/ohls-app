import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, View, StyleSheet, Text, TextInput } from 'react-native';
import { Avatar, Card, FAB, List } from 'react-native-paper';
import { Button, EasyToast, Input, NoDataFound } from '../components';
import theme from '../constants/theme';
import { getBearerTokenFromStorage, getDecodedTokenFromStorage } from '../utils/auth';
import urls from '../utils/urls';

const ViewLawyerProfile = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setuser] = useState(null);

  const [lawyer, setLawyer] = useState({});
  const [showReviews, setShowReviews] = useState(false);
  const [reviewVal, setreviewVal] = useState('');
  const [reviewErr, setreviewErr] = useState('');
  const [isLoading, setisLoading] = useState(false);

  // EasyToast
  const toastRef = useRef();
  const [toastType, setToastType] = useState('');

  useEffect(() => {
    handleLoggedIn();
    if (props.route && props.route.params && props.route.params.lawyer) {
      getCurrentUser();
      setLawyer(props.route.params.lawyer);
    }
    return () => {
    }
  }, [props]);

  const handleLoggedIn = async () => {
    const token = await getDecodedTokenFromStorage();
    if (token !== null) {
      setIsLoggedIn(true);
      setuser(token);
    }
  }

  const getCurrentUser = async () => {
    try {
      await axios({
        method: 'GET',
        url: urls.USER_BY_ID + props.route.params.lawyer._id,
      }).then(res => {
        setLawyer(res.data.data);
      }).catch(err => {
        console.log('getting user error:', err)
      })
    } catch (err) {
      console.log('errnnn:', err)
    }
  }

  const handleAddreview = async () => {
    if (reviewVal === '') {
      setreviewErr('Required*');
      return;
    }
    try {
      setisLoading(true);
      let data = {};
      data = {
        review: reviewVal,
        c_name: user.fullName,
      }
      await axios({
        method: 'PUT',
        url: urls.ADD_REVIEW + lawyer._id,
        data: data
      }).then(res => {
        setreviewVal('');
        setisLoading(false);
        getCurrentUser();
        setToastType('success');
        toastRef && toastRef.current && toastRef.current.show('Review Added Successfully', 1000, () => {});
      }).catch(err => {
        setisLoading(false);
        console.log('add review error:', err);
        setToastType('err');
        toastRef && toastRef.current && toastRef.current.show('Something went wrong, Please try again later!', 1000, () => {});
      })
    } catch (err) {
      setisLoading(false);
      console.log('errnnn:', err)
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: theme.SIZES.BASE }}
      showsVerticalScrollIndicator={false}
    >
      <EasyToast
        toastRef={toastRef}
        type={toastType}
        position={'top'}
      />
      <Card style={{ flex: 1 }}>
        <Card.Title title={lawyer && lawyer.fullName} subtitle={lawyer && lawyer.city} />
        <Card.Content>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <View style={{ flexDirection: 'column', width: '70%' }}>
              <Text style={{ fontSize: 12, color: theme.COLORS.GRAY }}>Gender</Text>
              <Text style={styles.text}>{lawyer && lawyer.gender}</Text>
              <View style={{ height: 10 }} />
              <Text style={{ fontSize: 12, color: theme.COLORS.GRAY }}>Office Address</Text>
              <Text style={styles.text}>{lawyer && lawyer.address}</Text>
            </View>
            <View>
              <Avatar.Image size={100}
                source={lawyer && lawyer.avatar !== '' ?
                  { uri: lawyer.avatar }
                  :
                  require('../assets/images/avatar.jpg')}
              />
            </View>
          </View>

          {/* Portfolio */}
          <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold', marginTop: 20 }]}>Portfolio</Text>
          <Text style={[styles.text, { marginVertical: 10 }]}
          >{lawyer && lawyer.portfolio ? lawyer.portfolio : 'No portfolio'}</Text>
          {/* End of portfolio */}

          {/* Case Handled */}
          <Text style={[styles.text, { fontSize: 16, fontWeight: 'bold', marginTop: 20 }]}>Case Handled</Text>
          {lawyer && lawyer.caseHandled ?
            lawyer.caseHandled.map((element, index) => (
              <View style={styles.caseHandledContainer} key={index}>
                <Text style={[styles.text, { marginBottom: 5 }]}>{element.type}</Text>
                <Text style={[styles.text, { marginVertical: 0 }]}>{element.details}</Text>
              </View>
            ))
            :
            <Text style={[styles.text, { marginVertical: 10 }]}          >{'No caseHandled'}</Text>
          }
          {/* End of Case Handled */}

          {user && user.role === 'lawyer' ?
            <></>
            :
            <>
              <Chat
                navigation={props.navigation}
                user={user}
                lawyer={lawyer}
              />
              <View style={{ width: '100%', marginVertical: 20 }}>
                <List.Item
                  onPress={() => setShowReviews(!showReviews)}
                  style={styles.list}
                  titleStyle={styles.listTxt}
                  title={'Reviews'}
                  left={() => <MaterialIcons name={'rate-review'} style={styles.left_icon} size={20} color={theme.COLORS.PRIMARY} />}
                  right={() => <AntDesign name={showReviews ? 'up' : 'down'} style={styles.left_icon} size={15} color={theme.COLORS.PRIMARY} />}
                />
                {showReviews && lawyer && lawyer.reviews && lawyer.reviews.length > 0 ?
                  <View style={{ maxHeight: 300, borderWidth: 0.5, borderColor: theme.COLORS.SHADOW, padding: 10 }}>
                    <ScrollView nestedScrollEnabled={true} >
                      {lawyer.reviews && lawyer.reviews.map((item, index) => (
                        <View key={index} style={{ marginBottom: 20 }}>
                          <View style={{ flexDirection: 'row', borderBottomColor: theme.COLORS.SHADOW, borderBottomWidth: 0.5, justifyContent: 'space-between', paddingBottom: 5, marginBottom: 5 }}>
                            <Text style={styles.text}>{item.c_name}</Text>
                            <Text style={styles.text}>{item.entry_date && item.entry_date.substring(0, 10)}</Text>
                          </View>
                          <Text style={styles.text}>{item.review}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                  :
                  showReviews &&
                  <View style={{ borderWidth: 0.5, borderColor: theme.COLORS.SHADOW, padding: 10 }}>
                    <NoDataFound />
                  </View>
                }
              </View>
              {isLoggedIn &&
                <View style={{ marginTop: 10, borderTopColor: theme.COLORS.SHADOW, borderTopWidth: 0.5, paddingTop: 10 }}>
                  <Text style={[styles.text, { marginBottom: 5 }]}>{'Want to review Lawyer?'}</Text>
                  <Input
                    label={'Your Review'}
                    placeholder={'Type your review here'}
                    value={reviewVal}
                    onChangeText={(val) => { setreviewVal(val), setreviewErr('') }}
                    error={reviewErr}
                  />
                  <Button
                    title={'Add Review'}
                    uppercase={false}
                    small
                    width="100%"
                    loading={isLoading}
                    disabled={isLoading}
                    onRight
                    onPress={() => handleAddreview()}
                  />
                </View>
              }
            </>
          }
        </Card.Content>
      </Card>
    </ScrollView >
  )
}

const Chat = props => {
  const { user, navigation, lawyer } = props;

  return (
    <FAB
      style={styles.fab}
      uppercase={false}
      label='Chat'
      color={theme.COLORS.WHITE}
      icon="chat"
      onPress={() =>
        user === null ?
          navigation.navigate('Login')
          :
          navigation.navigate('Chats', {
            screen: 'ChatScreen',
            params: {
              sender: user,
              receiver: lawyer,
            }
          })
      }
    />
  )
}

const styles = StyleSheet.create({
  list: {
    borderRadius: 5,
    borderColor: theme.COLORS.SHADOW,
    borderWidth: 1,

  },
  listTxt: {
    fontSize: 14,
    color: 'gray',
  },
  left_icon: {
    display: 'flex',
    alignItems: 'center',
    marginVertical: 5,
    marginRight: 15
  },
  text: {
    color: theme.COLORS.LIGHT_BLACK
  },
  chat: {
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    backgroundColor: theme.COLORS.PRIMARY,
    marginRight: 'auto'
  },
  caseHandledContainer: {
    marginVertical: 10,
    padding: 10,
    borderColor: theme.COLORS.BORDER,
    borderWidth: 1,
    borderRadius: 5,
  }
})

export default ViewLawyerProfile;