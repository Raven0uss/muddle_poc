import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Header from "../Components/Header";
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";
import { useIsFocused } from "@react-navigation/native";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import UserContext from "../CustomProperties/UserContext";
import themeSchema from "../CustomProperties/Theme";
import { removeItem } from "../CustomProperties/storage";
import { isEmpty, get } from "lodash";
import { Snackbar } from "react-native-paper";
import { gql, useMutation } from "@apollo/client";

const checkPasswordStrong = (password) => {
  if (password.search(/\d/) === -1)
    return {
      error: true,
      message: i18n._("passwordNeedNumbers"),
    };
  if (password.search(/[a-zA-Z]/) === -1)
    return {
      error: true,
      message: i18n._("passwordNeedLetters"),
    };
  return null;
};

const checkPassword = (password, confirmPassword) => {
  if (password !== confirmPassword)
    return {
      error: true,
      message: i18n._("notSamePassword"),
    };
  if (password.length < 8 || password.length > 30) {
    return {
      error: true,
      message: i18n._("password8Char"),
    };
  }
  if (password.length > 30) {
    return {
      error: true,
      message: i18n._("password30Char"),
    };
  }
  return checkPasswordStrong(password);
};

const CHECK_PASSWORD_DATABASE = gql`
  mutation($userId: ID!, $currentPassword: String!) {
    checkPasswordOk(userId: $userId, currentPassword: $currentPassword) {
      value
    }
  }
`;

const MODIFY_PASSWORD = gql`
  mutation($userId: ID!, $newPassword: String!) {
    changePassword(userId: $userId, newPassword: $newPassword) {
      value
    }
  }
`;

const ChangePassword = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { currentUser, setCurrentUser } = React.useContext(UserContext);
  const [refresh, setRefresh] = React.useState(true);
  const [visibility, setVisibility] = React.useState(false);

  const [snack, setSnack] = React.useState({
    visible: false,
    type: "success",
    message: "",
  });

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");

  const isFocused = useIsFocused();
  React.useEffect(() => {
    setRefresh(true);
  }, [isFocused]);

  const { navigation, route } = props;

  const disabledButton =
    isEmpty(currentPassword) ||
    isEmpty(newPassword) ||
    isEmpty(confirmNewPassword);

  const [modifyPassword, { loading: loadingModify }] = useMutation(
    MODIFY_PASSWORD,
    {
      onCompleted: (response) => {
        console.log(response);
        removeItem("token");
        removeItem("user");
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Login",
              params: {
                snackType: "success",
                snackMessage: i18n._("succesModifyPassword"),
                snack: true,
                refreshUser: true,
              },
            },
          ],
        });
      },
    }
  );

  const [checkPasswordDatabase, { loading: loadingCheck }] = useMutation(
    CHECK_PASSWORD_DATABASE,
    {
      onCompleted: async (response) => {
        const { checkPasswordOk } = response;
        const isSame = get(checkPasswordOk, "value", -1) === 0;
        if (isSame) {
          console.log(newPassword);
          console.log(currentUser.id);
          await modifyPassword({
            variables: {
              userId: currentUser.id,
              newPassword,
            },
          });
        } else {
          setSnack({
            visible: true,
            type: "error",
            message: i18n._("passwordAccountNotSame"),
          });
        }
      },
    }
  );

  return (
    <View style={styles.container}>
      <Header
        LeftComponent={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: 3 }}
            disabled={loadingCheck || loadingModify}
          >
            <CustomIcon name={"chevron-left"} size={38} />
          </TouchableOpacity>
        }
        MiddleComponent={
          <Image
            source={{ uri: muddle.nb }}
            style={{
              width: 50,
              height: 28,
              marginTop: 8,
              marginLeft: -32,
              marginBottom: 10,
            }}
          />
        }
      />
      <ScrollView
        style={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: themeSchema[theme].backgroundColor1,
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 20,
        }}
      >
        <Text
          style={{
            marginTop: 15,
            marginBottom: 30,
            alignSelf: "center",
            fontFamily: "Montserrat_700Bold",
            color: themeSchema[theme].colorText,
          }}
        >
          {i18n._("changePasswordTitle")}
        </Text>
        <View
          style={{
            ...styles.passwordBloc,
            backgroundColor: themeSchema[theme].backgroundColor2,
          }}
        >
          <TextInput
            placeholder={i18n._("currentPassword")}
            value={currentPassword}
            onChangeText={(p) => setCurrentPassword(p)}
            style={{
              ...styles.passwordInput,
              color: themeSchema[theme].colorText,
              backgroundColor: themeSchema[theme].backgroundColor2,
            }}
            keyboardType="default"
            placeholderTextColor={themeSchema[theme].colorText}
            secureTextEntry={!visibility}
            editable={loadingModify === false && loadingCheck === false}
          />
          <View style={styles.passwordIcon}>
            <TouchableOpacity onPress={() => setVisibility((v) => !v)}>
              <CustomIcon
                name={`visibility${visibility ? "" : "-off"}`}
                size={32}
                color={"#F47658"}
                style={styles.passwordIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            ...styles.passwordBloc,
            backgroundColor: themeSchema[theme].backgroundColor2,
          }}
        >
          <TextInput
            placeholder={i18n._("newPassword")}
            value={newPassword}
            onChangeText={(p) => setNewPassword(p)}
            style={{
              ...styles.passwordInput,
              color: themeSchema[theme].colorText,
              backgroundColor: themeSchema[theme].backgroundColor2,
            }}
            keyboardType="default"
            placeholderTextColor={themeSchema[theme].colorText}
            secureTextEntry={!visibility}
            editable={loadingModify === false && loadingCheck === false}
          />
        </View>
        <View
          style={{
            ...styles.passwordBloc,
            backgroundColor: themeSchema[theme].backgroundColor2,
          }}
        >
          <TextInput
            placeholder={i18n._("confirmNewPassword")}
            value={confirmNewPassword}
            onChangeText={(p) => setConfirmNewPassword(p)}
            style={{
              ...styles.passwordInput,
              color: themeSchema[theme].colorText,
              backgroundColor: themeSchema[theme].backgroundColor2,
            }}
            keyboardType="default"
            placeholderTextColor={themeSchema[theme].colorText}
            secureTextEntry={!visibility}
            editable={loadingModify === false && loadingCheck === false}
          />
        </View>
        <TouchableOpacity
          onPress={async () => {
            const checkPass = checkPassword(newPassword, confirmNewPassword);
            if (checkPass !== null) {
              setSnack({
                visible: true,
                type: "error",
                message: checkPass.message,
              });
              return;
            }
            if (newPassword === currentPassword) {
              setSnack({
                visible: true,
                type: "error",
                message: i18n._("sameCurrentNewPassword"),
              });
              return;
            }
            await checkPasswordDatabase({
              variables: {
                currentPassword,
                userId: currentUser.id,
              },
            });
          }}
          style={{
            alignSelf: "flex-end",
            backgroundColor: disabledButton ? "#d3d3d3" : "#F47658",
            padding: 12,
            paddingLeft: 30,
            paddingRight: 30,
            borderRadius: 30,
            marginTop: 20,
          }}
          disabled={disabledButton || loadingCheck || loadingModify}
        >
          {loadingCheck ? (
            <ActivityIndicator size={18} color="black" />
          ) : (
            <Text
              style={{
                color: "#000",
                fontFamily: "Montserrat_700Bold",
              }}
            >
              {i18n._("changePasswordButton")}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F47658",
  },
  seedContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#FFF",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
  },
  // menuElement: {
  //   backgroundColor: themeSchema[theme].backgroundColor1,
  //   width: Dimensions.get("screen").width / 1.1,
  //   marginTop: 8,
  //   borderRadius: 12,
  //   padding: 8,
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  menuText: {
    marginLeft: 10,
    fontSize: 14,
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
});

export default ChangePassword;
