import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  ScrollView,
} from "react-native";
import Header from "../Components/Header";
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";
import { useIsFocused } from "@react-navigation/native";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import i18n from "../i18n";
import UserContext from "../CustomProperties/UserContext";
import { gql, useMutation } from "@apollo/client";

const UPDATE_THEME = gql`
  mutation($userId: ID!, $theme: Theme!) {
    updateUser(where: { id: $userId }, data: { theme: $theme }) {
      id
    }
  }
`;

const Settings = (props) => {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);
  const [refresh, setRefresh] = React.useState(true);

  const [updateTheme] = useMutation(UPDATE_THEME);

  const isFocused = useIsFocused();
  React.useEffect(() => {
    setRefresh(true);
  }, [isFocused]);

  const { navigation, route } = props;
  return (
    <View style={styles.container}>
      <Header
        LeftComponent={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: 3 }}
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
          backgroundColor: themeSchema[theme].backgroundColor2,
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 20,
        }}
      >
        <TouchableOpacity
          style={{
            ...styles.menuElement,
            backgroundColor: themeSchema[theme].backgroundColor1,
          }}
          onPress={() => navigation.push("LanguageSettings")}
        >
          <CustomIcon name="language" size={28} color="#F47658" />
          <Text
            style={{ ...styles.menuText, color: themeSchema[theme].colorText }}
          >
            {i18n._("switchLanguage")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.menuElement,
            backgroundColor: themeSchema[theme].backgroundColor1,
          }}
          onPress={() => {
            toggleTheme();
            updateTheme({
              variables: {
                userId: currentUser.id,
                theme: theme === "light" ? "DARK" : "LIGHT",
              },
            });
          }}
        >
          <CustomIcon name="flare" size={28} color="#F47658" />
          <Text
            style={{ ...styles.menuText, color: themeSchema[theme].colorText }}
          >
            {theme === "light"
              ? i18n._("selectDarkTheme")
              : i18n._("selectLightTheme")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.menuElement,
            backgroundColor: themeSchema[theme].backgroundColor1,
          }}
          onPress={() => navigation.push("VotesPrivacy")}
        >
          <CustomIcon name="vpn-key" size={28} color="#F47658" />
          <Text
            style={{ ...styles.menuText, color: themeSchema[theme].colorText }}
          >
            {i18n._("votePrivacy")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  menuElement: {
    backgroundColor: "#F7F7F7",
    width: Dimensions.get("screen").width / 1.1,
    marginTop: 8,
    borderRadius: 12,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
});

export default Settings;
