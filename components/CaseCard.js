import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Button } from '.';
import theme from '../constants/theme';
import urls from '../utils/urls';

const CaseCard = (props) => {
  const { item, onPress, loading, user, from, handleAcceptOffer, handleDeclineOffer, handleEndCase } = props;
  const [isAlreadyRequested, setIsAlreadyRequested] = useState(false);
  const [requests, setRequests] = useState([]);
  const [assignedTo, setAssignedTo] = useState(null);

  useEffect(() => {
    from !== 'MyCases' && item && item.requests && item.requests.forEach(element => {
      if (element.lawyer_id === user._id) {
        setIsAlreadyRequested(true);
      }
    });
    if (from === 'MyCases') {
      if (item && item.assigned) {
        getAssignedTo(item.assigned_to);
      }
      item && item.requests && item.requests.forEach((element) => {
        getUserById(element);
      })
    }
  }, [item]);

  useEffect(() => {
    setRequests([]);
    setAssignedTo(null);
  }, [item]);

  const getUserById = async (element) => {
    await axios({
      method: 'GET',
      url: urls.USER_BY_ID + element.lawyer_id,
    }).then(res => {
      setRequests([...requests, { ...element, user: res.data.data }]);
    }).catch(err => {
      console.log('getUserById in card case error:', err);
    });
  }

  const getAssignedTo = async (id) => {
    await axios({
      method: 'GET',
      url: urls.USER_BY_ID + id,
    }).then(res => {
      setAssignedTo(res.data.data);
    }).catch(err => {
      console.log('getAssignedTo in card case error:', err);
    });
  }


  if (isAlreadyRequested) {
    return null;
  }

  const Item = props => {
    const { label, value } = props;
    return (
      <View style={{ flexDirection: 'row', flex: 1, marginVertical: 5 }}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.text, { fontWeight: 'bold' }]} >{label}</Text>
        </View>
        <View style={{ flex: 3 }}>
          <Text style={[styles.text, { fontWeight: 'normal' }]} >{value}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{ padding: 0, margin: 0 }}>
        <Item label={'Case Type'} value={item && item.type} />
        <Item label={'Case Details'} value={item && item.details} />
        <Item label={'Assigned'} value={item && item.assigned ? 'True' : 'False'} />

        {item && assignedTo && item.assigned &&
          <Item label={'Assigned to'} value={assignedTo.fullName} />
        }
        {item && item.is_deleted && from === 'MyCases' &&
          <Item label={'Status'} value={'Your case is dismissed by lawyer. Please rate your expedience with lawyer'} />
        }
        <Item label={'Created at'} value={item && item.entry_date.substring(0, 10)} />

        {from === 'MyCases' &&
          <View style={styles.requestsContainer}>
            {requests && requests.map((element, index) => {
              return (
                <View style={styles.requestItem}>
                  <View>
                    <Item label={'Lawyer Name'} value={element.user.fullName} />
                    <Item label={'Created at'} value={element.entry_date.substring(0, 10)} />
                  </View>
                  <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      title={'Accept Offer'}
                      uppercase={false}
                      small
                      width='45%'
                      disabled={loading}
                      onPress={() => handleAcceptOffer(element._id, element.lawyer_id)}
                    />
                    <Button
                      title={'Decline Offer'}
                      uppercase={false}
                      width='45%'
                      small
                      disabled={loading}
                      onPress={() => handleDeclineOffer(element._id)}
                    />
                  </View>
                </View>
              )
            })}
          </View>
        }

        {from !== 'MyCases' && from !== 'AssignedCases' &&
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              title={'Send Offer'}
              uppercase={false}
              small
              onRight
              disabled={loading}
              onPress={() => onPress()}
            />
          </View>
        }

        {from === 'AssignedCases' &&
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              title={'End Case'}
              uppercase={false}
              small
              onRight
              disabled={loading}
              onPress={() => handleEndCase()}
            />
          </View>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    padding: 10,
    borderRadius: 3,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.WHITE,
    shadowOffset: { width: 4, height: 4 },
    elevation: 3,
    shadowRadius: 3
  },
  text: {
    color: theme.COLORS.TEXT,
  },
  requestsContainer: {
    marginVertical: 10,
  },
  requestItem: {
    borderColor: theme.COLORS.BORDER,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  }
})


export default CaseCard
