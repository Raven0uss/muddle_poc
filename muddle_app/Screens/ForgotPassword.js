import i18n from "../i18n";
import React from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";
import Header from "../Components/Header";
import LangSelect from "../Components/LangMiniature";
import { muddle } from "../CustomProperties/IconsBase64";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import { gql, useMutation } from "@apollo/client";
import { Snackbar } from "react-native-paper";

const FORGOT_PASSWORD = gql`
  mutation($email: String!) {
    forgotPassword(email: $email) {
      token
    }
  }
`;

function ForgotPasswordComponent(props) {
  const { theme } = React.useContext(ThemeContext);
  const [email, setEmail] = React.useState("");

  const [snack, setSnack] = React.useState({
    visible: false,
    type: "error",
    message: "",
  });

  const [forgotPassword, { loading, error }] = useMutation(FORGOT_PASSWORD, {
    variables: {
      email,
    },
    onCompleted: () => {
      navigation.navigate("Login", {
        snackType: "success",
        snackMessage: i18n._("successMessage_MailSendForgotPassword"),
        snack: true,
      });
    },
    onError: () => {
      setSnack({
        visible: true,
        type: "error",
        message: i18n._("errorMessage_MailDoesntExist"),
      });
    },
  });

  const { navigation, route } = props;
  // const { colors } = props.theme;

  const containerStyle = StyleSheet.flatten([
    styles.container,
    { backgroundColor: "#F47658" },
  ]);

  return (
    <View style={containerStyle}>
      <Header hidden />
      <View style={styles.languageBloc}>
        <LangSelect changeLanguage={route.params.changeLanguage} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.connectionContainer}
      >
        <Image
          style={styles.logo}
          source={{
            uri: muddle.nb_with_name,
          }}
        />
        <View style={styles.formConnexion}>
          <TextInput
            placeholder={i18n._("mailAddress")}
            value={email}
            autoCapitalize="none"
            onChangeText={(e) => setEmail(e)}
            onBlur={() => {
              setEmail((e) => e.toLowerCase().trim());
            }}
            style={{
              ...styles.input,
              backgroundColor: themeSchema[theme].backgroundColor2,
            }}
            keyboardType="default"
            placeholderTextColor={themeSchema[theme].colorText}
          />
          <TouchableOpacity
            onPress={async () => {
              Keyboard.dismiss();
              await forgotPassword();
            }}
            style={styles.connectionButton}
          >
            <Text
              style={{
                color: "#F47658",
                fontFamily: "Montserrat_700Bold",
              }}
            >
              {i18n._("forgotPassword")}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.noAccountBloc}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Text style={styles.noAccountText}>
            <Text style={styles.subscriptionLink}>{i18n._("goToConnect")}</Text>
          </Text>
        </TouchableWithoutFeedback>
      </View>
      <Snackbar
        visible={snack.visible}
        onDismiss={() =>
          setSnack({
            visible: false,
            message: snack.message,
            type: snack.type,
          })
        }
        duration={2500}
        style={{
          backgroundColor: snack.type === "success" ? "#4BB543" : "#DB0F13",
          borderRadius: 10,
        }}
      >
        {snack.message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  connectionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  formConnexion: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    paddingLeft: 20,
    paddingRight: 20,
    width: "100%",
    borderRadius: 10,
    color: "#000",
    marginBottom: 18,
    height: 40,
    fontFamily: "Montserrat_500Medium",
  },
  connectionButton: {
    alignSelf: "flex-end",
    backgroundColor: "#000",
    padding: 12,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 30,
    marginTop: 15,
  },
  noAccountBloc: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  noAccountText: {
    color: "#000",
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  subscriptionLink: {
    textDecorationLine: "underline",
    textDecorationColor: "#000",
    fontFamily: "Montserrat_500Medium",
  },
  languageBloc: {
    position: "absolute",
    marginTop: "10%",
    alignSelf: "flex-end",
    marginRight: "7%",
    zIndex: 2,
  },
  logo: {
    width: 170,
    height: 120,
  },
});

export default ForgotPasswordComponent;
