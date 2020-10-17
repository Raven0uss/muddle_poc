import "react-native-gesture-handler";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { Provider as PaperProvider } from "react-native-paper";
import { apolloClient } from "./apollo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { I18nProvider } from "@lingui/react";
import i18n, { getDeviceLocale } from "./i18n";

import HomeScreen from "./Screens/Home";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <I18nProvider i18n={i18n}>
        <ApolloProvider client={apolloClient}>
          <PaperProvider>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          </PaperProvider>
        </ApolloProvider>
      </I18nProvider>
    </NavigationContainer>
  );
}
