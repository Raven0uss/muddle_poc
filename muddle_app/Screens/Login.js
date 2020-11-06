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

function LoginComponent(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [visibility, setVisibility] = React.useState(false);

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
        {/* <Icon name="polymer" size={100} color={colors.primary} /> */}
        <Image
          style={styles.logo}
          source={{
            uri: muddle.nb_with_name,
          }}
        />
        {/* <Text style={styles.appName}>Muddles</Text> */}
        <View style={styles.formConnexion}>
          <TextInput
            placeholder="Nom d'utilisateur ou adresse mail"
            value={email}
            onChangeText={(e) => setEmail(e)}
            style={styles.input}
            keyboardType="default"
            placeholderTextColor="#222"
          />
          <View style={styles.passwordBloc}>
            <TextInput
              placeholder="Mot de passe"
              value={password}
              onChangeText={(p) => setPassword(p)}
              style={styles.passwordInput}
              keyboardType="default"
              placeholderTextColor="#222"
              secureTextEntry={!visibility}
            />
            <View style={styles.passwordIcon}>
              <TouchableOpacity onPress={() => setVisibility((v) => !v)}>
                <Icon
                  name={`visibility${visibility ? "" : "-off"}`}
                  size={32}
                  color={colors.secondary}
                  style={styles.passwordIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableWithoutFeedback
            onPress={() => navigation.push("ForgotPassword")}
          >
            <Text style={styles.noAccountText}>
              <Text style={styles.subscriptionLink}>Mot de passe oublie ?</Text>
            </Text>
          </TouchableWithoutFeedback>
          <TouchableOpacity
            onPress={() => {
              console.log("Connection");
              // navigation.push("Test");
            }}
            style={styles.connectionButton}
          >
            <Text style={{ color: colors.secondary, fontWeight: "bold" }}>
              Se connecter
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.noAccountBloc}>
        <TouchableWithoutFeedback onPress={() => navigation.push("SignUp")}>
          <Text style={styles.noAccountText}>
            Pas de compte ?{" "}
            <Text style={styles.subscriptionLink}>S'inscrire</Text>
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
    // flex: 1,
    // flexDirection: "column",
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

export default withTheme(LoginComponent);
