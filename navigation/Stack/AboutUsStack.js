import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Header from '../../components/Header';
import AboutUs from '../../Screens/AboutUs';

const Stack = createStackNavigator();

export default function AboutUsStack(props) {
  const { user } = props;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AboutUs"
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title={"About Us"}
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      >
        {(prop) => <AboutUs {...props}{...prop} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}