import React from "react";
import {
  Text,
  TextInput,
  View,
  SafeAreaView,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { withTheme } from "react-native-paper";
import Icon from "../Components/Icon";
import { Trans } from "@lingui/macro";
import i18n from "../i18n";
import Header from "../Components/Header";
import LangSelect from "../Components/LangMiniature";
import { muddle } from "../CustomProperties/IconsBase64";

function ForgotPasswordComponent(props) {
  const [email, setEmail] = React.useState("");

  const { navigation, route } = props;
  const { colors } = props.theme;

  const containerStyle = StyleSheet.flatten([
    styles.container,
    { backgroundColor: colors.secondary },
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
            placeholder="Adresse mail"
            value={email}
            onChangeText={(e) => setEmail(e)}
            style={styles.input}
            keyboardType="default"
            placeholderTextColor="#222"
          />
          <TouchableOpacity
            onPress={() => {
              console.log("Connection");
              navigation.goBack();
            }}
            style={styles.connectionButton}
          >
            <Text style={{ color: colors.secondary, fontWeight: "bold" }}>
              Mot de passe oublie
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.noAccountBloc}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Text style={styles.noAccountText}>
            <Text style={styles.subscriptionLink}>S'identifier</Text>
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
  connectionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  appName: {
    fontSize: 36,
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
  },
  passwordBloc: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  passwordIcon: {
    flexDirection: "row",
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  passwordInput: {
    backgroundColor: "#fff",
    padding: 12,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    width: "80%",
    color: "#000",
    height: 40,
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
  },
  subscriptionLink: {
    textDecorationLine: "underline",
    textDecorationColor: "#000",
  },
  languageBloc: {
    position: "absolute",
    marginTop: "10%",
    alignSelf: "flex-end",
    marginRight: "7%",
    zIndex: 2,
  },
  logo: {
    width: 148,
    height: 120,
  },
});

export default withTheme(ForgotPasswordComponent);
