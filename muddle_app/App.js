import "react-native-gesture-handler";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { Provider as PaperProvider } from "react-native-paper";
import { apolloClient } from "./apollo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { I18nProvider } from "@lingui/react";
import i18n, { getDeviceLocale } from "./i18n";

import LoginScreen from "./Screens/Login";
import SignUpScreen from "./Screens/SignUp";
import ForgotPasswordScreen from "./Screens/ForgotPassword";

import TestScreen from "./Screens/Test";

import theme from "./CustomProperties/Theme";
import HomeScreen from "./Screens/Home";

const Stack = createStackNavigator();

// const mode = "COMPONENTS";
const mode = "APP";
// const mode = "LOGIN";

const setInitialRoute = () => {
  switch (mode) {
    case "COMPONENTS":
      return "Test";
    case "APP":
      return "Home";
    case "LOGIN":
      return "Login";
    default:
      return "Login";
  }
};

export default function App() {
  const [language, setLanguage] = React.useState(getDeviceLocale());

  const changeLanguage = (lang) => {
    console.log(lang);
    i18n.activate(lang);
    setLanguage(lang);
  };

  return (
    <NavigationContainer>
      <I18nProvider i18n={i18n} language={language}>
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
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{
                  changeLanguage,
                  user: {
                    //Test
                    name: "test",
                  },
                }}
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
