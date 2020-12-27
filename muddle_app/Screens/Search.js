import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Text,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import Header from "../Components/Header";
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";
import { useQuery, gql } from "@apollo/client";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import strUcFirst from "../Library/strUcFirst";
import UserContext from "../CustomProperties/UserContext";
import i18n from "../i18n";
import CertifiedIcon from "../Components/CertifiedIcon";
import { isBlocked, isBlockingMe } from "../Library/isBlock";

const GET_USERS = gql`
  query($firstname: String!, $lastname: String!) {
    users(
      where: {
        firstname_contains: $firstname
        lastname_contains: $lastname
        AND: [
          { role_not: MUDDLE }
          { role_not: ADMIN }
          { role_not: MODERATOR }
        ]
      }
    ) {
      id
      firstname
      lastname
      email
      certified
      profilePicture
      coverPicture
      crowned
    }
  }
`;

const Search = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);
  const [users, setUsers] = React.useState([]);
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [skipFetch, setSkipFetch] = React.useState(true);
  const { loading, error } = useQuery(GET_USERS, {
    variables: {
      firstname: strUcFirst(firstname),
      lastname: strUcFirst(lastname),
    },
    onCompleted: (response) => {
      const { users: queryResult } = response;

      setUsers(queryResult);
      setSkipFetch(true);
    },
    skip: skipFetch,
  });

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
      <View
        style={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: themeSchema[theme].backgroundColor2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: Dimensions.get("screen").width,
            marginTop: 33,
            marginBottom: 35,
          }}
        >
          <View
            style={{
              width: "60%",
            }}
          >
            <TextInput
              placeholder={i18n._("firstname")}
              value={firstname}
              style={{
                height: 40,
                borderRadius: 10,
                width: "100%",
                backgroundColor: themeSchema[theme].backgroundColor1,
                // marginLeft: "auto",
                // marginRight: "auto",
                padding: 10,
                paddingLeft: 20,
                paddingRight: 20,
                fontSize: 14,
                // marginBottom: 14,
                fontFamily: "Montserrat_500Medium",
                color: themeSchema[theme].colorText,
              }}
              keyboardType="default"
              placeholderTextColor={themeSchema[theme].colorText}
              onChangeText={(s) => setFirstname(s)}
            />
            <TextInput
              placeholder={i18n._("lastname")}
              value={lastname}
              style={{
                height: 40,
                borderRadius: 10,
                width: "100%",
                // marginLeft: 10,
                marginTop: 5,
                backgroundColor: themeSchema[theme].backgroundColor1,
                // marginLeft: "auto",
                // marginRight: "auto",
                padding: 10,
                paddingLeft: 20,
                paddingRight: 20,
                fontSize: 14,
                // marginBottom: 14,
                fontFamily: "Montserrat_500Medium",
                color: themeSchema[theme].colorText,
              }}
              keyboardType="default"
              placeholderTextColor={themeSchema[theme].colorText}
              onChangeText={(s) => setLastname(s)}
            />
          </View>

          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#F47658",
              marginLeft: 10,
              padding: 10,
              borderRadius: 10,
            }}
            onPress={() => {
              Keyboard.dismiss();
              setSkipFetch(false);
            }}
            disabled={firstname.length < 3 && lastname.length < 3}
          >
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 12,
                color: "#000",
              }}
            >
              {i18n._("search")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={{
          ...styles.seedContainer,
          backgroundColor: themeSchema[theme].backgroundColor2,
        }}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          users
            .filter(
              (u) =>
                isBlocked({ userId: u.id, currentUser }) === false &&
                isBlockingMe({ userId: u.id, currentUser }) === false
            )
            .map((u) => {
              if (u.id === currentUser.id) return null;
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.push("Profile", {
                      userId: u.email,
                    })
                  }
                >
                  <View
                    style={{
                      backgroundColor: themeSchema[theme].backgroundColor1,
                      padding: 10,
                      flexDirection: "row",
                      marginTop: 5,
                      marginBottom: 10,
                      alignItems: "center",
                      borderRadius: 12,
                    }}
                  >
                    <Image
                      source={{ uri: u.profilePicture }}
                      style={styles.userPicture}
                    />

                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Montserrat_500Medium",
                        marginLeft: 10,
                        color: themeSchema[theme].colorText,
                      }}
                    >
                      {`${u.firstname} ${u.lastname}`}
                      {u.certified && <CertifiedIcon />}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
        )}
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
    backgroundColor: "#FFFFFF",
    paddingLeft: 15,
    paddingRight: 15,
  },
  userPicture: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
});

export default Search;
