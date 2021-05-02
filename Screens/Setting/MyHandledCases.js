import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, TextInput } from 'react-native'
import theme from '../../constants/theme'
import urls from '../../utils/urls';

export default function MyHandledCases(props) {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    if (props.route && props.route.params && props.route.params.data) {
      getUser(props.route.params.data);
    }
    return () => {
    }
  }, []);

  const getUser = async (id) => {
    await axios({
      method: 'GET',
      url: urls.USER_BY_ID + id,
    }).then(res => {
      setCases(res.data.data.caseHandled);
    }).catch(err => {
      console.log('getAssignedTo in card case error:', err);
    });
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: theme.SIZES.BASE * 2 }} showsVerticalScrollIndicator={false}>
      {cases ?
        cases.map((element, index) => (
          <View style={styles.caseHandledContainer} key={index}>
            <Text style={[styles.text, { marginBottom: 5 }]}>{element.type}</Text>
            <Text style={[styles.text, { marginVertical: 0 }]}>{element.details}</Text>
          </View>
        ))
        :
        <Text style={[styles.text, { marginVertical: 10 }]}          >{'No caseHandled'}</Text>
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  text: {
    color: theme.COLORS.TEXT,
  },
  caseHandledContainer: {
    marginVertical: 10,
    padding: 10,
    borderColor: theme.COLORS.BORDER,
    borderWidth: 1,
    borderRadius: 5,
  }
})
