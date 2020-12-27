import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
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
import { useQuery, gql, useMutation } from "@apollo/client";
import { get } from "lodash";
import CertifiedIcon from "../Components/CertifiedIcon";
import { storeItem } from "../CustomProperties/storage";

const GET_BLACK_LIST = gql`
  query($userId: ID!) {
    user(where: { id: $userId }) {
      id
      blocked {
        firstname
        lastname
        id
        profilePicture
      }
    }
  }
`;

const UNBLOCK_USER = gql`
  mutation($userId: ID!, $currentUserId: ID!) {
    updateUser(
      where: { id: $currentUserId }
      data: { blocked: { disconnect: { id: $userId } } }
    ) {
      id
    }
  }
`;

const BlackList = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { currentUser, setCurrentUser } = React.useContext(UserContext);
  const [blockList, setBlockList] = React.useState([]);
  const { loading, error } = useQuery(GET_BLACK_LIST, {
    variables: {
      userId: currentUser.id,
    },
    onCompleted: (response) => {
      const { user: queryResult } = response;
      const list = get(queryResult, "blocked", []);
      setBlockList(list);
    //   console.log(list);
    },
    fetchPolicy: "cache-and-network",
  });

  const [unblockUser] = useMutation(UNBLOCK_USER);

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
          flex: 1,
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 20,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: themeSchema[theme].backgroundColor2,
        }}
      >
        <Text
          style={{
            marginTop: 15,
            marginBottom: 20,
            textAlign: "center",
            fontFamily: "Montserrat_700Bold",
            color: themeSchema[theme].colorText,
          }}
        >
          {i18n._("userBlockedTitle")}
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
          {i18n._("unblockInstruction")}
        </Text>
        {loading ? (
          <ActivityIndicator size={36} />
        ) : (
          <ScrollView
          // style={{
          //   borderTopLeftRadius: 15,
          //   borderTopRightRadius: 15,
          //   backgroundColor: themeSchema[theme].backgroundColor2,
          //   paddingLeft: 15,
          //   paddingRight: 15,
          //   paddingTop: 20,
          // }}
          >
            {blockList.map((user) => (
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
                  source={{ uri: user.profilePicture }}
                  style={styles.userPicture}
                />

                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Montserrat_500Medium",
                    marginLeft: 10,
                    color: themeSchema[theme].colorText,
                  }}
                >
                  {`${user.firstname} ${user.lastname}`}
                  {user.certified && <CertifiedIcon />}
                </Text>
                <TouchableOpacity
                  style={{
                    marginLeft: "auto",
                  }}
                  onLongPress={() => {
                    // console.log("wesh");
                    setCurrentUser((c) => {
                      const blockIndex = c.blocked.findIndex(
                        (u) => u.id === user.id
                      );
                      const blockedCopy = JSON.parse(JSON.stringify(c.blocked));
                      blockedCopy.splice(blockIndex, 1);
                      return {
                        ...c,
                        blocked: blockedCopy,
                      };
                    });
                    setBlockList((c) => {
                      const blockIndex = c.findIndex((u) => u.id === user.id);
                      console.log(blockIndex);
                      const blockedCopy = JSON.parse(JSON.stringify(c));
                      blockedCopy.splice(blockIndex, 1);
                      return blockedCopy;
                    });
                    unblockUser({
                      variables: {
                        userId: user.id,
                        currentUserId: currentUser.id,
                      },
                    });
                  }}
                >
                  <Text
                    style={{
                      color: "#FF0000",
                      fontFamily: "Montserrat_600SemiBold",
                    }}
                  >
                    {i18n._("unblockAction")}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
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
  userPicture: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
});

export default BlackList;
