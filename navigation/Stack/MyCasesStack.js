import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Header from '../../components/Header';
import MyCases from '../../Screens/MyCases';

const Stack = createStackNavigator();

export default function MyCasesStack(props) {
  const { user } = props;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyCases"
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title={"My Cases"}
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      >
        {(prop) => <MyCases {...props}{...prop} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}