import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import CustomIcon from "./Icon";
import Select from "../Components/Select";
import { not } from "react-native-reanimated";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";

const NotificationBox = (props) => {
  const [status, setStatus] = React.useState(props.notification.status);
  const { notification, theme, navigation } = props;

  //   console.log(notification);

  switch (notification.type) {
    case "VOTE":
      return (
        <View
          style={{
            width: "90%",
            borderRadius: 10,
            backgroundColor: themeSchema[theme].backgroundColor1,
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 5,
            marginBottom: 10, // android
            padding: 15,
          }}
        >
          {notification.new && (
            <View
              style={{
                width: 9,
                height: 9,
                backgroundColor: "#F47658",
                position: "absolute",
                //   alignSelf: "flex-end",
                marginTop: 9,
                borderRadius: 50,
                right: 0,
                marginRight: 10,
              }}
            />
          )}
          <Image
            source={{ uri: notification.who[0].profilePicture }}
            style={styles.userPicture}
          />
          <View
            style={{
              marginLeft: 20,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_600SemiBold",
                marginTop: -5,
                color: themeSchema[theme].colorText,
              }}
            >
              {`${notification.who[0].firstname} ${notification.who[0].lastname}`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
                  color: themeSchema[theme].colorText,
                }}
              >
                {`${i18n._("voteOnYourDebate")} ${i18n._("ago", {
                  time: "2h",
                })}`}
              </Text>
            </View>
          </View>
        </View>
      );
    case "INVITATION_DUO":
      return (
        <View
          style={{
            width: "90%",
            borderRadius: 10,
            backgroundColor: themeSchema[theme].backgroundColor1,
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 5,
            marginBottom: 10, // android
            padding: 15,
          }}
        >
          {notification.new && (
            <View
              style={{
                width: 9,
                height: 9,
                backgroundColor: "#F47658",
                position: "absolute",
                //   alignSelf: "flex-end",
                marginTop: 9,
                borderRadius: 50,
                right: 0,
                marginRight: 10,
              }}
            />
          )}
          <Image
            source={{ uri: notification.who[0].profilePicture }}
            style={styles.userPicture}
          />
          <View
            style={{
              marginLeft: 20,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_600SemiBold",
                marginTop: -5,
                color: themeSchema[theme].colorText,
              }}
            >
              {`${notification.who[0].firstname} ${notification.who[0].lastname}`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                color: themeSchema[theme].colorText,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
                  color: themeSchema[theme].colorText,
                }}
              >
                {`${i18n._("inviteYouDuoDebate")}`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: themeSchema[theme].backgroundColor2,
                  width: 100,
                  borderRadius: 12,
                }}
                disabled={status === "DECLINED"}
                onPress={() => {
                  navigation.push("CreateDuoDebate", {
                    debate: notification.debate,
                  });
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                    color: themeSchema[theme].colorText,
                  }}
                >
                  {`${i18n._("accept")}`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    status === "DECLINED"
                      ? themeSchema[theme].colorText
                      : themeSchema[theme].colorText3,
                  width: 100,
                  borderRadius: 12,
                }}
                onPress={() => {
                  // HERE SEND REQUEST TO DELETE DUO DEBATE
                  setStatus("DECLINED");
                }}
                disabled={status === "DECLINED"}
              >
                <Text
                  style={{
                    color:
                      status === "DECLINED"
                        ? themeSchema[theme].colorText3
                        : themeSchema[theme].colorText,
                    fontFamily: "Montserrat_500Medium",
                  }}
                >
                  {`${i18n._("decline")}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    case "COMMENT":
      return (
        <View
          style={{
            width: "90%",
            borderRadius: 10,
            backgroundColor: themeSchema[theme].backgroundColor1,
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 5,
            marginBottom: 10, // android
            padding: 15,
          }}
        >
          {notification.new && (
            <View
              style={{
                width: 9,
                height: 9,
                backgroundColor: "#F47658",
                position: "absolute",
                //   alignSelf: "flex-end",
                marginTop: 9,
                borderRadius: 50,
                right: 0,
                marginRight: 10,
              }}
            />
          )}
          <Image
            source={{ uri: notification.who[0].profilePicture }}
            style={styles.userPicture}
          />
          <View
            style={{
              marginLeft: 20,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_600SemiBold",
                marginTop: -5,
                color: themeSchema[theme].colorText,
              }}
            >
              {`${notification.who[0].firstname} ${
                notification.who[0].lastname
              }${
                notification.who.length > 1
                  ? ` ${i18n._("and")} ${notification.who.length - 1} ${
                      notification.who.length - 1 > 1
                        ? i18n._("otherPeopleSingular")
                        : i18n._("otherPeoplePlural")
                    }`
                  : ""
              }`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                color: themeSchema[theme].colorText,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
                  color: themeSchema[theme].colorText,
                }}
              >
                {`${
                  notification.who.length > 1
                    ? i18n._("commentYourDebatePlural")
                    : i18n._("commentYourDebateSingular")
                }`}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
                }}
              >
                {` ${i18n._("ago", {
                  time: "2h",
                })}`}
              </Text>
            </View>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 12,
                marginTop: 5,
                fontFamily: "Montserrat_500Medium",
                color: themeSchema[theme].colorText,
              }}
            >
              {notification.debate.content}
            </Text>
          </View>
        </View>
      );
    case "CLOSE_DEBATE":
      return (
        <View
          style={{
            width: "90%",
            borderRadius: 10,
            backgroundColor: themeSchema[theme].backgroundColor1,
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 5,
            marginBottom: 10, // android
            padding: 15,
          }}
        >
          {notification.new && (
            <View
              style={{
                width: 9,
                height: 9,
                backgroundColor: "#F47658",
                position: "absolute",
                //   alignSelf: "flex-end",
                marginTop: 9,
                borderRadius: 50,
                right: 0,
                marginRight: 10,
              }}
            />
          )}
          <Image
            source={{ uri: notification.who[0].profilePicture }}
            style={styles.userPicture}
          />
          <View
            style={{
              marginLeft: 20,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_600SemiBold",
                marginTop: -5,
                color: themeSchema[theme].colorText,
              }}
            >
              {`${notification.who[0].firstname} ${notification.who[0].lastname}`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
                  color: themeSchema[theme].colorText,
                }}
              >
                {` ${i18n._("askToCloseThisDebate")} ${i18n._("ago", {
                  time: "2h",
                })}`}
              </Text>
            </View>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 12,
                marginTop: 5,
                fontFamily: "Montserrat_500Medium",
                color: themeSchema[theme].colorText,
              }}
            >
              {notification.debate.content}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: themeSchema[theme].backgroundColor2,
                  width: 100,
                  borderRadius: 12,
                }}
                disabled={status === "DECLINED"}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                    color: themeSchema[theme].colorText,
                  }}
                >
                  {`${i18n._("accept")}`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    status === "DECLINED"
                      ? themeSchema[theme].colorText
                      : themeSchema[theme].colorText3,
                  width: 100,
                  borderRadius: 12,
                }}
                disabled={status === "DECLINED"}
                onPress={() => {
                  // HERE JUST SEND REQUEST TO UPDATE NOTIFICATION STATUS
                  setStatus("DECLINED");
                }}
              >
                <Text
                  style={{
                    color:
                      status === "DECLINED"
                        ? themeSchema[theme].colorText3
                        : themeSchema[theme].colorText,
                    fontFamily: "Montserrat_500Medium",
                  }}
                >
                  {`${i18n._("decline")}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    case "LIKE":
      return (
        <View
          style={{
            width: "90%",
            borderRadius: 10,
            backgroundColor: themeSchema[theme].backgroundColor1,
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 5,
            marginBottom: 10, // android
            padding: 15,
          }}
        >
          {notification.new && (
            <View
              style={{
                width: 9,
                height: 9,
                backgroundColor: "#F47658",
                position: "absolute",
                //   alignSelf: "flex-end",
                marginTop: 9,
                borderRadius: 50,
                right: 0,
                marginRight: 10,
              }}
            />
          )}
          <Image
            source={{ uri: notification.who[0].profilePicture }}
            style={styles.userPicture}
          />
          <View
            style={{
              marginLeft: 20,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_600SemiBold",
                marginTop: -5,
                color: themeSchema[theme].colorText,
              }}
            >
              {`${notification.who[0].firstname} ${
                notification.who[0].lastname
              }${
                notification.who.length > 1
                  ? ` ${i18n._("and")} ${notification.who.length - 1} ${
                      notification.who.length - 1 > 1
                        ? i18n._("otherPeopleSingular")
                        : i18n._("otherPeoplePlural")
                    }`
                  : ""
              }`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
                  color: themeSchema[theme].colorText,
                }}
              >
                {`${
                  notification.who.length > 1
                    ? i18n._("likedCommentSingular")
                    : i18n._("likedCommentPlural")
                }`}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
                  color: themeSchema[theme].colorText,
                }}
              >
                {" il y a 3 jours"}
              </Text>
            </View>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 12,
                marginTop: 5,
                fontFamily: "Montserrat_500Medium",
                color: themeSchema[theme].colorText,
              }}
            >
              {notification.comment.content}
            </Text>
          </View>
        </View>
      );
    case "DISLIKE":
      return (
        <View
          style={{
            width: "90%",
            borderRadius: 10,
            backgroundColor: themeSchema[theme].backgroundColor1,
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 5,
            marginBottom: 10, // android
            padding: 15,
          }}
        >
          {notification.new && (
            <View
              style={{
                width: 9,
                height: 9,
                backgroundColor: "#F47658",
                position: "absolute",
                //   alignSelf: "flex-end",
                marginTop: 9,
                borderRadius: 50,
                right: 0,
                marginRight: 10,
              }}
            />
          )}
          <Image
            source={{ uri: notification.who[0].profilePicture }}
            style={styles.userPicture}
          />
          <View
            style={{
              marginLeft: 20,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_600SemiBold",
                marginTop: -5,
                color: themeSchema[theme].colorText,
              }}
            >
              {`${notification.who[0].firstname} ${
                notification.who[0].lastname
              }${
                notification.who.length > 1
                  ? ` ${i18n._("and")} ${notification.who.length - 1} ${
                      notification.who.length - 1 > 1
                        ? i18n._("otherPeopleSingular")
                        : i18n._("otherPeoplePlural")
                    }`
                  : ""
              }`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
                  color: themeSchema[theme].colorText,
                }}
              >
                {`${
                  notification.who.length > 1
                    ? i18n._("didntLikedCommentSingular")
                    : i18n._("didntLikedCommentPlural")
                }`}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
                  color: themeSchema[theme].colorText,
                }}
              >
                {` ${i18n._("ago", {
                  time: "2h",
                })}`}
              </Text>
            </View>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 12,
                marginTop: 5,
                fontFamily: "Montserrat_500Medium",
                color: themeSchema[theme].colorText,
              }}
            >
              {notification.comment.content}
            </Text>
          </View>
        </View>
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  userPicture: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  userPicture: {
    width: 40,
    height: 40,
    borderRadius: 30,
    position: "absolute",
    zIndex: 10,
    // marginTop: -10,
    marginLeft: -15,
    // borderColor: "black",
    // borderWidth: 1,
  },
});

export default NotificationBox;
