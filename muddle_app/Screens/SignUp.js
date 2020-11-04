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
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { withTheme } from "react-native-paper";
import Icon from "../Components/Icon";
import { Trans } from "@lingui/macro";
import i18n from "../i18n";
import Header from "../Components/Header";
import Switch from "../Components/Switch";

function SignUpComponent(props) {
  const [form, setForm] = React.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: new Date(),
    gender: "",
    cgu: false,
  });
  const [visibility, setVisibility] = React.useState(false);

  const { navigation } = props;
  const { colors } = props.theme;

  const containerStyle = StyleSheet.flatten([
    styles.container,
    { backgroundColor: colors.secondary },
  ]);

  return (
    <View style={containerStyle}>
      <Header hidden />
      <Text style={styles.languageBloc}>Francais</Text>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.connectionContainer}
      >
        <Icon name="polymer" size={100} color={colors.primary} />
        {/* <Text style={styles.appName}>Muddles</Text> */}
        <View style={styles.formConnexion}>
          <TextInput
            placeholder="Nom d'utilisateur"
            value={form.username}
            onChangeText={(username) =>
              setForm((previousState) => ({
                ...previousState,
                username,
              }))
            }
            style={styles.input}
            keyboardType="default"
            placeholderTextColor="#222"
          />
          <TextInput
            placeholder="Adresse mail"
            value={form.email}
            onChangeText={(email) =>
              setForm((previousState) => ({
                ...previousState,
                email,
              }))
            }
            style={styles.input}
            keyboardType="default"
            placeholderTextColor="#222"
          />
          <View style={styles.passwordBloc}>
            <TextInput
              placeholder="Mot de passe"
              value={form.password}
              onChangeText={(password) =>
                setForm((previousState) => ({
                  ...previousState,
                  password,
                }))
              }
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
          <TextInput
            placeholder="Confirmer mot de passe"
            value={form.confirmPassword}
            onChangeText={(confirmPassword) =>
              setForm((previousState) => ({
                ...previousState,
                confirmPassword,
              }))
            }
            style={styles.input}
            keyboardType="default"
            placeholderTextColor="#222"
            secureTextEntry={!visibility}
          />
          <View style={styles.cguBloc}>
            <Switch
              onValueChange={() =>
                setForm((previousState) => ({
                  ...previousState,
                  cgu: !previousState.cgu,
                }))
              }
              value={form.cgu}
            />
            <Text style={styles.cguText}>
              J'accepte les <Text style={styles.subscriptionLink}>CGU</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              console.log("SignUp");
              // navigation.push("Test");
            }}
            style={styles.connectionButton}
          >
            <Text style={{ color: colors.secondary, fontWeight: "bold" }}>
              S'inscrire
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.noAccountBloc}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Text style={styles.noAccountText}>
            Deja inscrit ?{" "}
            <Text style={styles.subscriptionLink}>Se connecter</Text>
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
  },

  connectionButton: {
    alignSelf: "flex-end",
    backgroundColor: "#000",
    padding: 12,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 30,
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
    marginRight: "10%",
  },
  cguBloc: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 10,
    justifyContent: "center",
  },
  cguText: {
    padding: 9,
  },
});

export default withTheme(SignUpComponent);
