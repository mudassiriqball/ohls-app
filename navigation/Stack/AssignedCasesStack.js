import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Header from '../../components/Header';
import theme from '../../constants/theme';
import AssignedCases from '../../Screens/AssignedCases';

const Stack = createStackNavigator();

export default function AssignedCasesStack(props) {
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
        {(prop) => <AssignedCases {...props}{...prop} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}