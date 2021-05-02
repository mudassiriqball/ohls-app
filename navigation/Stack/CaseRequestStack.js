import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Header from '../../components/Header';
import theme from '../../constants/theme';
import CaseRequest from '../../Screens/CaseRequest';

const Stack = createStackNavigator();

export default function CaseRequestStack(props) {
  const { user } = props;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CaseRequest"
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title={"Case Request"}
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      >
        {(prop) => <CaseRequest {...props}{...prop} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}