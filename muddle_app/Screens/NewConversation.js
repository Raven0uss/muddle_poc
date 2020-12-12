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
import getUnique from "../Library/getUnique";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import strUcFirst from "../Library/strUcFirst";

const GET_FOLLOWERS_CONVERSATIONS = gql`
  query($email: String!) {
    user(where: { email: $email }) {
      id
      followers {
        id
        firstname
        lastname
        email
        certified
        profilePicture
        coverPicture
        crowned
        conversations {
          id
          speakers {
            id
            firstname
            lastname
            email
            profilePicture
          }
          messages {
            id
            content
            from {
              id
              firstname
              lastname
              email
              profilePicture
            }
            to {
              id
              firstname
              lastname
              email
              profilePicture
            }
          }
        }
      }
      following {
        id
        firstname
        lastname
        certified
        profilePicture
        coverPicture
        crowned
        email
        conversations {
          id
          speakers {
            id
            firstname
            lastname
            profilePicture
            email
          }
          messages {
            id
            content
            from {
              id
              firstname
              lastname
              email
              profilePicture
            }
            to {
              id
              firstname
              lastname
              email
              profilePicture
            }
          }
        }
      }
    }
  }
`;

const NewConversation = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const [users, setUsers] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const { loading, error } = useQuery(GET_FOLLOWERS_CONVERSATIONS, {
    variables: {
      email: props.route.params.userId,
    },
    onCompleted: (response) => {
      const { user: queryResult } = response;
      const { followers, following } = queryResult;

      const userList = [...followers, ...following];
      const lookup = userList.reduce((a, e) => {
        a[e.id] = ++a[e.id] || 0;
        return a;
      }, {});
      setUsers(
        getUnique(userList, "id").sort((a, b) => a.email.localeCompare(b.email))
      );
    },
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
          <TextInput
            placeholder={i18n._("searchContact")}
            value={search}
            style={{
              height: 40,
              borderRadius: 10,
              width: Dimensions.get("screen").width / 1.2,
              backgroundColor: themeSchema[theme].backgroundColor1,
              color: themeSchema[theme].colorText,
              // marginLeft: "auto",
              // marginRight: "auto",
              padding: 10,
              paddingLeft: 20,
              paddingRight: 20,
              // marginBottom: 14,
              fontFamily: "Montserrat_500Medium",
            }}
            keyboardType="default"
            onChangeText={(s) => setSearch(s)}
            placeholderTextColor={themeSchema[theme].colorText}
          />
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
            .filter((u) => {
              if (search.length > 0) {
                return (
                  u.firstname.indexOf(strUcFirst(search)) !== -1 ||
                  u.lastname.indexOf(strUcFirst(search)) !== -1
                );
              }
              return true;
            }) // filter by search text
            .map((u) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.push("Chat", {
                    conversation: u.conversation,
                  });
                }}
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
                  </Text>
                </View>
              </TouchableOpacity>
            ))
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

export default NewConversation;
