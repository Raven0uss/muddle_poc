import React from "react";
import {
  Text,
  TextInput,
  View,
  Keyboard,
  // SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { withTheme } from "react-native-paper";
import Icon from "../Components/Icon";
import Header from "../Components/Header";
import LangSelect from "../Components/LangMiniature";
import { muddle } from "../CustomProperties/IconsBase64";
import { Snackbar } from "react-native-paper";
import i18n from "../i18n";

function LoginComponent(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [visibility, setVisibility] = React.useState(false);

  const [snack, setSnack] = React.useState({
    visible: false,
    type: "success",
    message: "",
  });

  const { navigation, route } = props;
  const { colors } = props.theme;

  React.useEffect(() => {
    const params = props.route.params;
    console.log(params);
    setSnack({
      visible: params.snack,
      type: params.snackType,
      message: params.snackMessage,
    });
  }, [props.route.params]);

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
            placeholder={i18n._("mailAddress")}
            value={email}
            onChangeText={(e) => setEmail(e)}
            style={styles.input}
            keyboardType="default"
            placeholderTextColor="#222"
          />
          <View style={styles.passwordBloc}>
            <TextInput
              placeholder={i18n._("password")}
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
              <Text style={styles.subscriptionLink}>
                {i18n._("forgotPassword?")}
              </Text>
            </Text>
          </TouchableWithoutFeedback>
          <TouchableOpacity
            onPress={() => {
              console.log("Connection");
              Keyboard.dismiss();
              // setSnack({
              //   visible: true,
              //   message: "L'identifiant ou le mot de passe est incorrect.",
              //   type: "error",
              // });
              // navigation.navigate("Home", {
              //   user: {
              //     name: "test",
              //   },
              // });
              navigation.reset({
                index: 0,
                routes: [{ name: "Home", params: { user: "test" } }],
              });
            }}
            style={styles.connectionButton}
            // disabled
          >
            <Text
              style={{
                color: colors.secondary,
                fontFamily: "Montserrat_700Bold",
              }}
            >
              {i18n._("connect")}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.noAccountBloc}>
        <TouchableWithoutFeedback onPress={() => navigation.push("SignUp")}>
          <Text style={styles.noAccountText}>
            {i18n._("noAccount?")}{" "}
            <Text style={styles.subscriptionLink}>
              {i18n._("goToSubscribe")}
            </Text>
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
    flex: 2,
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

export default withTheme(LoginComponent);
