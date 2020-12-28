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
  ActivityIndicator,
} from "react-native";
import Icon from "../Components/Icon";
import Header from "../Components/Header";
import LangSelect from "../Components/LangMiniature";
import { muddle } from "../CustomProperties/IconsBase64";
import { Snackbar } from "react-native-paper";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import UserContext from "../CustomProperties/UserContext";
import themeSchema from "../CustomProperties/Theme";
import { storeItem, removeItem, getItem } from "../CustomProperties/storage";
import { useQuery, gql } from "@apollo/client";
import { get, set } from "lodash";

const LOGIN = gql`
  query($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
    }
  }
`;

const GET_CURRENT_USER = gql`
  query {
    currentUser {
      id
      email
      firstname
      certified
      lastname
      language
      profilePicture
      coverPicture
      language
      theme
      role
      blocked {
        id
      }
      blocking {
        id
      }
    }
  }
`;

// const SignIn = (props) => {

// }

function LoginComponent(props) {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const { setCurrentUser, currentUser } = React.useContext(UserContext);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [visibility, setVisibility] = React.useState(false);
  const [skipLogin, setSkipLogin] = React.useState(true);
  const [skipGetUser, setSkipGetUser] = React.useState(true);

  React.useEffect(() => {
    const detectConnected = async () => {
      const token = await getItem("token");

      // console.log(token);
      if (token !== null) {
        console.log("The token is already here, auto login trigger !");
        setSkipGetUser(false);
      }
    };

    detectConnected();

    return () => {
      setSkipLogin(true);
      setSkipGetUser(true);
    };
  }, []);

  const {
    data: dataLogin,
    loading: loadingLogin,
    error: errorLogin,
  } = useQuery(LOGIN, {
    variables: {
      email,
      password,
    },
    skip: skipLogin,
    fetchPolicy: "network-only",
  });

  const {
    data: dataGetUser,
    loading: loadingGetUser,
    error: errorGetUser,
  } = useQuery(GET_CURRENT_USER, {
    skip: skipGetUser,
    fetchPolicy: "network-only",
  });

  React.useEffect(() => {
    if (!skipLogin) {
      const onCompleted = () => {};
      const onError = () => {};
      if (onCompleted || onError) {
        console.log("Trying to get token...");
        if (onCompleted && !loadingLogin && !errorLogin) {
          console.log("Token has been trigger !...");
          const storeTokenAndTriggerGetUser = async () => {
            const { signIn: queryResult } = dataLogin;
            const result = await storeItem("token", queryResult.token);
            console.log("Token has been stored ! :)");

            setSkipGetUser(false); // Trigger get user
            setSkipLogin(true);
          };
          storeTokenAndTriggerGetUser();
        } else if (onError && !loadingLogin && errorLogin) {
          console.log("An error occured with token :(");
          setSkipLogin(true);
          setSkipGetUser(true);

          setSnack({
            visible: true,
            message: i18n._("invalidCredential"),
            type: "error",
          });
        }
      }
    }
  }, [loadingLogin, dataLogin, errorLogin]);

  React.useEffect(() => {
    if (!skipGetUser) {
      const onCompleted = () => {};
      const onError = () => {};
      if (onCompleted || onError) {
        console.log("Trying to get user...");
        if (onCompleted && !loadingGetUser && !errorGetUser) {
          console.log("User has been trigger !...");
          const storeUserAndRedirect = async () => {
            const { currentUser: queryResult } = dataGetUser;
            if (
              queryResult.role === "ADMIN" ||
              queryResult.role === "MODERATOR"
            ) {
              removeItem("token");
              setSkipGetUser(true);
              setSnack({
                visible: true,
                message: i18n._("accessDenied"),
                type: "error",
              });
              return;
            }
            setCurrentUser(queryResult);
            const token = await storeItem("user", JSON.stringify(queryResult));
            console.log("User has been stored ! :)");
            const userTheme = get(queryResult, "theme");

            if (userTheme && theme !== userTheme.toLowerCase()) {
              const detectedTheme = userTheme.toLowerCase();
              if (detectedTheme === "dark" || detectedTheme === "light")
                toggleTheme(detectedTheme);
            }

            const userLanguage = get(queryResult, "language");
            if (userLanguage && userLanguage.toLowerCase() !== i18n.language) {
              const detectedLanguage = userLanguage.toLowerCase();
              if (detectedLanguage === "fr" || detectedLanguage === "en")
                i18n.activate(detectedLanguage);
            }

            setSkipGetUser(true);
            setSkipLogin(true);

            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          };
          storeUserAndRedirect();
        } else if (onError && !loadingGetUser && errorGetUser) {
          console.log(errorGetUser);
          console.log("An error occured with user :(");

          setSkipLogin(true);
          setSkipGetUser(true);
        }
      }
    }
  }, [loadingGetUser, dataGetUser, errorGetUser]);

  const [snack, setSnack] = React.useState({
    visible: false,
    type: "success",
    message: "",
  });

  const { navigation, route } = props;

  React.useEffect(() => {
    const params = props.route.params;
    // console.log(params);
    setSnack({
      visible: params.snack,
      type: params.snackType,
      message: params.snackMessage,
    });
  }, [props.route.params]);

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
            onChangeText={(e) => setEmail(e)}
            style={{
              ...styles.input,
              color: themeSchema[theme].colorText,
              backgroundColor: themeSchema[theme].backgroundColor2,
            }}
            keyboardType="default"
            placeholderTextColor={themeSchema[theme].colorText}
          />
          <View
            style={{
              ...styles.passwordBloc,
              backgroundColor: themeSchema[theme].backgroundColor2,
            }}
          >
            <TextInput
              placeholder={i18n._("password")}
              value={password}
              onChangeText={(p) => setPassword(p)}
              style={{
                ...styles.passwordInput,
                color: themeSchema[theme].colorText,
                backgroundColor: themeSchema[theme].backgroundColor2,
              }}
              keyboardType="default"
              placeholderTextColor={themeSchema[theme].colorText}
              secureTextEntry={!visibility}
            />
            <View style={styles.passwordIcon}>
              <TouchableOpacity onPress={() => setVisibility((v) => !v)}>
                <Icon
                  name={`visibility${visibility ? "" : "-off"}`}
                  size={32}
                  color={"#F47658"}
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
              Keyboard.dismiss();
              setSkipLogin(false);
            }}
            style={{
              ...styles.connectionButton,
              ...((email.length <= 0 || password.length <= 0) &&
              !loadingGetUser &&
              !loadingLogin
                ? {
                    backgroundColor: "#00000076",
                  }
                : {}),
            }}
            disabled={
              loadingLogin ||
              loadingGetUser ||
              email.length <= 0 ||
              password.length <= 0
            }
          >
            {loadingLogin || loadingGetUser ? (
              <ActivityIndicator color="#F47658" />
            ) : (
              <Text
                style={{
                  color: "#F47658",
                  // ...(email.length <= 0 || password.length <= 0
                  //   ? {
                  //       color: "#00000077",
                  //     }
                  //   : {}),
                  fontFamily: "Montserrat_700Bold",
                }}
              >
                {i18n._("connect")}
              </Text>
            )}
          </TouchableOpacity>
          {/* DEBUG TOKEN */}

          {/* <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              removeItem("token");
              removeItem("currentUser");
              setCurrentUser(null);
            }}
            style={styles.connectionButton}
            // disabled
          >
            <Text
              style={{
                color: "#F47658",
                fontFamily: "Montserrat_700Bold",
              }}
            >
              DELETE TOKEN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              Keyboard.dismiss();
              console.log(await getItem("token"));
              console.log(await getItem("currentUser"));
              console.log(currentUser);
            }}
            style={styles.connectionButton}
            // disabled
          >
            <Text
              style={{
                color: "#F47658",
                fontFamily: "Montserrat_700Bold",
              }}
            >
              LOG ITEMS
            </Text>
          </TouchableOpacity> */}
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

export default LoginComponent;
