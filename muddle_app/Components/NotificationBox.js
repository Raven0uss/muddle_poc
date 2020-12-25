import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import CustomIcon from "./Icon";
import Select from "../Components/Select";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import { gql, useMutation } from "@apollo/client";
import CertifiedIcon from "./CertifiedIcon";
import getTimeSpent from "../Library/getTimeSpent";

const CLOSE_DEBATE = gql`
  mutation($debateId: ID!) {
    closeMyDebate(debateId: $debateId) {
      id
    }
  }
`;

const UPDATE_NOTIFICATION = gql`
  mutation($notificationId: ID!, $status: NotificationStatus!) {
    updateNotification(
      where: { id: $notificationId }
      data: { status: $status }
    ) {
      id
    }
  }
`;

const NotificationBox = (props) => {
  const [status, setStatus] = React.useState(props.notification.status);
  const { notification, theme, navigation } = props;

  const [closeDebate] = useMutation(CLOSE_DEBATE);
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION);

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
              {notification.who[0].certified && <CertifiedIcon />}
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
                {`${i18n._("voteOnYourDebate")} ${getTimeSpent(
                  notification.updatedAt
                )}`}
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
              {notification.who[0].certified && <CertifiedIcon />}
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
                  backgroundColor:
                    status === "ACCEPTED"
                      ? "#F47658"
                      : themeSchema[theme].backgroundColor2,
                  width: 100,
                  borderRadius: 12,
                }}
                disabled={status === "DECLINED" || status === "ACCEPTED"}
                onPress={() => {
                  navigation.push("CreateDuoDebate", {
                    debate: notification.debate,
                    notificationId: notification.id,
                    updateNotification,
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
                  updateNotification({
                    variables: {
                      notificationId: notification.id,
                      status: "DECLINED",
                    },
                  });
                }}
                disabled={status === "DECLINED" || status === "ACCEPTED"}
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
                        ? i18n._("otherPeoplePlural")
                        : i18n._("otherPeopleSingular")
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
                } `}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
                }}
              >
                {getTimeSpent(notification.updatedAt)}
              </Text>
            </View>
            <Text
              numberOfLines={3}
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
              {notification.who[0].certified && <CertifiedIcon />}
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
                {` ${i18n._("askToCloseThisDebate")} ${getTimeSpent(
                  notification.updatedAt
                )}`}
              </Text>
            </View>
            <Text
              numberOfLines={3}
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
                  backgroundColor:
                    status === "ACCEPTED"
                      ? "#F47658"
                      : themeSchema[theme].backgroundColor2,
                  width: 100,
                  borderRadius: 12,
                }}
                disabled={status === "DECLINED" || status === "ACCEPTED"}
                onPress={() => {
                  setStatus("ACCEPTED");
                  updateNotification({
                    variables: {
                      notificationId: notification.id,
                      status: "ACCEPTED",
                    },
                  });
                  closeDebate({
                    variables: {
                      debateId: notification.debate.id,
                    },
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
                disabled={status === "DECLINED" || status === "ACCEPTED"}
                onPress={() => {
                  // HERE JUST SEND REQUEST TO UPDATE NOTIFICATION STATUS
                  setStatus("DECLINED");
                  updateNotification({
                    variables: {
                      notificationId: notification.id,
                      status: "DECLINED",
                    },
                  });
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
                        ? i18n._("otherPeoplePlural")
                        : i18n._("otherPeopleSingular")
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
                    ? i18n._("likedCommentPlural")
                    : i18n._("likedCommentSingular")
                } `}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
                  color: themeSchema[theme].colorText,
                }}
              >
                {getTimeSpent(notification.updatedAt)}
              </Text>
            </View>
            <Text
              numberOfLines={3}
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
                        ? i18n._("otherPeoplePlural")
                        : i18n._("otherPeopleSingular")
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
                    ? i18n._("didntLikedCommentPlural")
                    : i18n._("didntLikedCommentSingular")
                } `}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
                  color: themeSchema[theme].colorText,
                }}
              >
                {getTimeSpent(notification.updatedAt)}
              </Text>
            </View>
            <Text
              numberOfLines={3}
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
