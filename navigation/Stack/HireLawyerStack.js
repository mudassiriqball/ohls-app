import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Header from '../../components/Header';
import theme from '../../constants/theme';
import HireLawyer from '../../Screens/HireLawyer';

const Stack = createStackNavigator();

export default function HireLawyerStack(props) {
  const { user } = props;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HireLawyer"
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title={"Hire a Lawyer"}
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      >
        {(prop) => <HireLawyer {...props}{...prop} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}