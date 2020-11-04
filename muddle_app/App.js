import "react-native-gesture-handler";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { Provider as PaperProvider } from "react-native-paper";
import { apolloClient } from "./apollo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { I18nProvider } from "@lingui/react";
import i18n from "./i18n";

import LoginScreen from "./Screens/Login";
import SignUpScreen from "./Screens/SignUp";

import TestScreen from "./Screens/Test"

import theme from "./CustomProperties/Theme";

const Stack = createStackNavigator();

const mode = "COMPONENTS";
// const mode = "APP";

const setInitialRoute = () => {
  switch (mode) {
    case "COMPONENTS":
      return "Test";
    case "APP":
      return "Login";
    default:
      return "Login";
  }
};

export default function App() {
  return (
    <NavigationContainer>
      <I18nProvider i18n={i18n}>
        <ApolloProvider client={apolloClient}>
          <PaperProvider theme={theme}>
            <Stack.Navigator initialRouteName={setInitialRoute()}>
              <Stack.Screen
                name="Test"
                component={TestScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
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
