import "react-native-gesture-handler";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import {
  ActivityIndicator,
  Provider as PaperProvider,
} from "react-native-paper";
import { apolloClient } from "./apollo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_100Thin_Italic,
  Montserrat_200ExtraLight,
  Montserrat_200ExtraLight_Italic,
  Montserrat_300Light,
  Montserrat_300Light_Italic,
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold,
  Montserrat_700Bold_Italic,
  Montserrat_800ExtraBold,
  Montserrat_800ExtraBold_Italic,
  Montserrat_900Black,
  Montserrat_900Black_Italic,
} from "@expo-google-fonts/montserrat";

import { I18nProvider } from "@lingui/react";
import i18n, { getDeviceLocale } from "./i18n";

import theme from "./CustomProperties/Theme";
import UserContext from "./CustomProperties/UserContext";

import TestScreen from "./Screens/Test";

import LoginScreen from "./Screens/Login";
import SignUpScreen from "./Screens/SignUp";
import ForgotPasswordScreen from "./Screens/ForgotPassword";

import HomeScreen from "./Screens/Home";
import MenuScreen from "./Screens/Menu";
import SearchScreen from "./Screens/Search";
import ConversationsScreen from "./Screens/Conversations";
import NotificationsScreen from "./Screens/Notifications";
import CreateDebateScreen from "./Screens/CreateDebate";
import FollowScreen from "./Screens/Follow";
import DebatesFilteredScreen from "./Screens/DebatesFiltered";
import ProfileScreen from "./Screens/Profile";
import SettingsScreen from "./Screens/Settings";
import LanguageSettingsScreen from "./Screens/LanguageSettings";
import ContactUsScreen from "./Screens/ContactUs";
import CguScreen from "./Screens/Cgu";
import LegaleMentionsScreen from "./Screens/LegaleMentions";
import VotesPrivacyScreen from "./Screens/VotesPrivacy";
import DebateScreen from "./Screens/Debate";
import ChatScreen from "./Screens/Chat";
import NewConversationScreen from "./Screens/NewConversation";
import TrophiesScreen from "./Screens/Trophies";
import IsolateCommentScreen from "./Screens/IsolateComment";
import ReportScreen from "./Screens/Report";

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
  let [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_100Thin_Italic,
    Montserrat_200ExtraLight,
    Montserrat_200ExtraLight_Italic,
    Montserrat_300Light,
    Montserrat_300Light_Italic,
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold,
    Montserrat_600SemiBold_Italic,
    Montserrat_700Bold,
    Montserrat_700Bold_Italic,
    Montserrat_800ExtraBold,
    Montserrat_800ExtraBold_Italic,
    Montserrat_900Black,
    Montserrat_900Black_Italic,
  });

  const changeLanguage = (lang) => {
    console.log(lang);
    i18n.activate(lang);
    setLanguage(lang);
  };

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <NavigationContainer>
      <I18nProvider i18n={i18n} language={language}>
        <ApolloProvider client={apolloClient}>
          <PaperProvider theme={theme}>
            {/* <UserContext.Provider> */}
            <Stack.Navigator initialRouteName={setInitialRoute()}>
              <Stack.Screen
                name="Test"
                component={TestScreen}
                options={{
                  headerShown: false,
                }}
              />

              {/* Login Part */}
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

              {/* Main */}
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
              <Stack.Screen
                name="Report"
                component={ReportScreen}
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
              <Stack.Screen
                name="Search"
                component={SearchScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Conversations"
                component={ConversationsScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="NewConversation"
                component={NewConversationScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="CreateDebate"
                component={CreateDebateScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Follow"
                component={FollowScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="DebatesFiltered"
                component={DebatesFilteredScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Trophies"
                component={TrophiesScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Debate"
                component={DebateScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="IsolateComment"
                component={IsolateCommentScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />

              {/* Menu */}
              <Stack.Screen
                name="Menu"
                component={MenuScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="LanguageSettings"
                component={LanguageSettingsScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ContactUs"
                component={ContactUsScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Cgu"
                component={CguScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="LegaleMentions"
                component={LegaleMentionsScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="VotesPrivacy"
                component={VotesPrivacyScreen}
                initialParams={{
                  changeLanguage,
                }}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
            {/* </UserContext.Provider> */}
          </PaperProvider>
        </ApolloProvider>
      </I18nProvider>
    </NavigationContainer>
  );
}
