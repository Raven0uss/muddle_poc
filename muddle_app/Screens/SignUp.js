import React from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import Icon from "../Components/Icon";
import Header from "../Components/Header";
import Switch from "../Components/Switch";
import DatePicker from "../Components/DatePicker";
import Select from "../Components/Select";
import LangSelect from "../Components/LangMiniature";
import { muddle } from "../CustomProperties/IconsBase64";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import { isEmpty, isNil } from "lodash";

const buttonIsDisable = ({
  firstname,
  lastname,
  email,
  password,
  confirmPassword,
  birthdate,
  gender,
  cgu,
}) => {
  if (
    isEmpty(firstname) ||
    isEmpty(lastname) ||
    isEmpty(email) ||
    isEmpty(password) ||
    isEmpty(confirmPassword) ||
    isNil(birthdate) ||
    isNil(gender) ||
    cgu === false
  )
    return true;
};

function SignUpComponent(props) {
  const { theme } = React.useContext(ThemeContext);
  const [form, setForm] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: null,
    gender: null,
    cgu: false,
  });
  const [visibility, setVisibility] = React.useState(false);

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
      <ScrollView>
        <View style={styles.connectionContainer}>
          <Image
            style={styles.logo}
            source={{
              uri: muddle.nb_with_name,
            }}
          />
          <View style={styles.formConnexion}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TextInput
                placeholder={i18n._("firstname")}
                value={form.firstname}
                onChangeText={(firstname) =>
                  setForm((previousState) => ({
                    ...previousState,
                    firstname,
                  }))
                }
                style={{
                  ...styles.input,
                  width: "48%",
                  color: themeSchema[theme].colorText,
                  backgroundColor: themeSchema[theme].backgroundColor2,
                }}
                keyboardType="default"
                placeholderTextColor={themeSchema[theme].colorText}
              />
              <TextInput
                placeholder={i18n._("lastname")}
                value={form.lastname}
                onChangeText={(lastname) =>
                  setForm((previousState) => ({
                    ...previousState,
                    lastname,
                  }))
                }
                style={{
                  ...styles.input,
                  width: "48%",
                  color: themeSchema[theme].colorText,
                  backgroundColor: themeSchema[theme].backgroundColor2,
                }}
                keyboardType="default"
                placeholderTextColor={themeSchema[theme].colorText}
              />
            </View>

            <TextInput
              placeholder={i18n._("mailAddress")}
              value={form.email}
              onChangeText={(email) =>
                setForm((previousState) => ({
                  ...previousState,
                  email,
                }))
              }
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
                value={form.password}
                onChangeText={(password) =>
                  setForm((previousState) => ({
                    ...previousState,
                    password,
                  }))
                }
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
            <TextInput
              placeholder={i18n._("confirmPassword")}
              value={form.confirmPassword}
              onChangeText={(confirmPassword) =>
                setForm((previousState) => ({
                  ...previousState,
                  confirmPassword,
                }))
              }
              style={{
                ...styles.input,
                color: themeSchema[theme].colorText,
                backgroundColor: themeSchema[theme].backgroundColor2,
              }}
              keyboardType="default"
              placeholderTextColor={themeSchema[theme].colorText}
              secureTextEntry={!visibility}
            />
            <DatePicker
              placeholder={i18n._("birthdate")}
              date={form.birthdate}
              onDateChange={(birthdate) => {
                setForm((previousState) => ({
                  ...previousState,
                  birthdate,
                }));
              }}
            />
            <Select
              list={[
                {
                  label: i18n._("gender_woman"),
                  value: "F",
                },
                {
                  label: i18n._("gender_man"),
                  value: "M",
                },
                {
                  label: i18n._("gender_not_defined"),
                  value: "ND",
                },
              ]}
              selected={form.gender}
              placeholder={i18n._("gender")}
              onSelect={(gender) =>
                setForm({
                  ...form,
                  gender,
                })
              }
            />
            <View style={styles.cguBloc}>
              <Switch
                onValueChange={() =>
                  setForm((previousState) => ({
                    ...previousState,
                    cgu: !previousState.cgu,
                  }))
                }
                inColor={themeSchema[theme].colorText}
                outColor={themeSchema[theme].backgroundColor2}
                value={form.cgu}
              />
              <Text style={styles.cguText}>
                {`${i18n._("iAcceptThe")} `}
                <Text style={styles.subscriptionLink}>
                  {i18n._("accronymCGU")}
                </Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                // console.log("SignUp");
                navigation.navigate("Login", {
                  snackType: "success",
                  snackMessage: i18n._("succesMailSubscribe"),
                  snack: true,
                });
              }}
              style={{
                ...styles.connectionButton,
                ...(buttonIsDisable(form)
                  ? {
                      backgroundColor: "#00000076",
                    }
                  : {}),
              }}
            >
              <Text
                style={{
                  color: "#F47658",
                  fontFamily: "Montserrat_700Bold",
                }}
              >
                {i18n._("subscribe")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={styles.noAccountBloc}>
        <TouchableWithoutFeedback
          onPress={() => navigation.goBack()}
          disabled={buttonIsDisable(form)}
        >
          <Text style={styles.noAccountText}>
            {`${i18n._("alreadyMember?")} `}
            <Text style={styles.subscriptionLink}>{i18n._("connect")}</Text>
          </Text>
        </TouchableWithoutFeedback>
      </View>
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
    marginBottom: 30,
    marginTop: 30,
  },
  formConnexion: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
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
  },
  languageBloc: {
    position: "absolute",
    marginTop: "10%",
    alignSelf: "flex-end",
    marginRight: "7%",
    zIndex: 2,
  },
  cguBloc: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 10,
    justifyContent: "center",
  },
  cguText: {
    padding: 9,
    fontFamily: "Montserrat_500Medium",
  },
  logo: {
    width: 127,
    height: 90,
  },
});

export default SignUpComponent;
