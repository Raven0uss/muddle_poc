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
  Keyboard,
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
import { Snackbar } from "react-native-paper";
import { gql, useMutation } from "@apollo/client";
import { isEmpty, get } from "lodash";

const CHECK_PASSWORD_DATABASE = gql`
  mutation($userId: ID!, $currentPassword: String!) {
    checkPasswordOk(userId: $userId, currentPassword: $currentPassword) {
      value
    }
  }
`;

const DeleteAccount = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { currentUser, setCurrentUser } = React.useContext(UserContext);
  const [refresh, setRefresh] = React.useState(true);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [visibility, setVisibility] = React.useState(false);

  const [snack, setSnack] = React.useState({
    visible: false,
    type: "success",
    message: "",
  });

  const isFocused = useIsFocused();
  React.useEffect(() => {
    setRefresh(true);
  }, [isFocused]);

  const [checkPasswordDatabase, { loading: loadingCheck }] = useMutation(
    CHECK_PASSWORD_DATABASE,
    {
      onCompleted: async (response) => {
        const { checkPasswordOk } = response;
        const isSame = get(checkPasswordOk, "value", -1) === 0;
        if (isSame) {
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

  const { navigation, route } = props;

  const disabledButton = isEmpty(currentPassword);

  return (
    <View style={styles.container}>
      <Header
        LeftComponent={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: 3 }}
            disabled={loadingCheck}
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
          {i18n._("deleteAccountTitle")}
        </Text>
        <Text
          style={{
            marginTop: 0,
            marginBottom: 10,
            textAlign: "center",
            fontFamily: "Montserrat_500Medium",
            color: themeSchema[theme].colorText,
            fontSize: 12,
          }}
        >
          {i18n._("deleteAccountInstruction")}
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
            editable={loadingCheck === false}
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
        <TouchableOpacity
          onPressIn={() => {
            Keyboard.dismiss();
          }}
          onLongPress={async () => {
            await checkPasswordDatabase({
              variables: {
                userId: currentUser.id,
                currentPassword,
              },
            });
          }}
          style={{
            alignSelf: "flex-end",
            backgroundColor: disabledButton ? "#d3d3d3" : "red",
            padding: 12,
            paddingLeft: 30,
            paddingRight: 30,
            borderRadius: 30,
            marginTop: 20,
          }}
          disabled={disabledButton || loadingCheck}
        >
          {loadingCheck ? (
            <ActivityIndicator size={18} color="white" />
          ) : (
            <Text
              style={{
                color: "#FFF",
                fontFamily: "Montserrat_700Bold",
              }}
            >
              {i18n._("deleteAccountButton")}
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
    marginBottom: 10,
    marginTop: 10,
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

export default DeleteAccount;
