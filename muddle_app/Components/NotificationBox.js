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

const DELETE_DEBATE = gql`
  mutation($debateId: ID!) {
    deleteMyDebate(debateId: $debateId) {
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

const NOTIFY_DEBATE = gql`
  mutation(
    $debateId: ID!
    $currentUserId: ID!
    $userId: String!
    $type: NotificationType!
  ) {
    createNotification(
      data: {
        who: { connect: { id: $currentUserId } }
        userId: $userId
        type: $type
        status: INFORMATION
        new: true
        debate: { connect: { id: $debateId } }
      }
    ) {
      id
    }
  }
`;

const NOTIFY_DELETE_DEBATE = gql`
  mutation($currentUserId: ID!, $userId: String!) {
    createNotification(
      data: {
        who: { connect: { id: $currentUserId } }
        userId: $userId
        type: ACCEPT_DELETE_DEBATE
        status: INFORMATION
        new: true
      }
    ) {
      id
    }
  }
`;

const NOTIFY_REJECT_DUO = gql`
  mutation($currentUserId: ID!, $userId: String!) {
    createNotification(
      data: {
        who: { connect: { id: $currentUserId } }
        userId: $userId
        type: REJECT_DUO
        status: INFORMATION
        new: true
      }
    ) {
      id
    }
  }
`;

const NotificationBox = (props) => {
  const [status, setStatus] = React.useState(props.notification.status);
  const {
    notification,
    theme,
    navigation,
    currentUser,
    setHomeDebates,
  } = props;

  const [notifyDebateAction] = useMutation(NOTIFY_DEBATE);
  const [notifyDebateDelete] = useMutation(NOTIFY_DELETE_DEBATE);
  const [notifyRejectDuo] = useMutation(NOTIFY_REJECT_DUO);

  const [closeDebate] = useMutation(CLOSE_DEBATE, {
    onCompleted: () => {
      notifyDebateAction({
        variables: {
          userId: notification.who[0].id,
          currentUserId: currentUser.id,
          debateId: notification.debate.id,
          type: "ACCEPT_CLOSE_DEBATE",
        },
      });
    },
  });

  // To avoid notif for duo
  const [deleteDebateDuo] = useMutation(DELETE_DEBATE);

  const [deleteDebate] = useMutation(DELETE_DEBATE, {
    onCompleted: () => {
      notifyDebateDelete({
        variables: {
          userId: notification.who[0].id,
          currentUserId: currentUser.id,
        },
      });
    },
  });

  const [updateNotification] = useMutation(UPDATE_NOTIFICATION);

  switch (notification.type) {
    case "VOTE":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("Debate", {
              setHomeDebates,
              currentUser,
              navigation,
              debate: notification.debate,
            });
          }}
        >
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
              source={{
                uri:
                  notification.who[notification.who.length - 1].profilePicture,
              }}
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
                {`${notification.who[notification.who.length - 1].firstname} ${
                  notification.who[notification.who.length - 1].lastname
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
                  {`${i18n._("voteOnYourDebate")} ${getTimeSpent(
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
            </View>
          </View>
        </TouchableOpacity>
      );
    case "INVITATION_DUO":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("CreateDuoDebate", {
              debate: notification.debate,
              notificationId: notification.id,
              updateNotification,
            });
          }}
        >
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
                  onPress={async () => {
                    // HERE SEND REQUEST TO DELETE DUO DEBATE
                    setStatus("DECLINED");
                    updateNotification({
                      variables: {
                        notificationId: notification.id,
                        status: "DECLINED",
                      },
                    });
                    await notifyRejectDuo({
                      variables: {
                        userId: notification.who[0].id,
                        currentUserId: currentUser.id,
                      },
                    });
                    deleteDebateDuo({
                      variables: { debateId: notification.debate.id },
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
        </TouchableOpacity>
      );
    case "ACCEPT_DUO":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("Debate", {
              setHomeDebates,
              currentUser,
              navigation,
              debate: notification.debate,
            });
          }}
        >
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
                  {`${i18n._("acceptYourInvitation")} ${getTimeSpent(
                    notification.createdAt
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
            </View>
          </View>
        </TouchableOpacity>
      );
    case "REJECT_DUO":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("Profile", {
              setHomeDebates,
              currentUser,
              navigation,
              userId: notification.who[0].email,
            });
          }}
        >
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
                  {`${i18n._("rejectYourInvitation")} ${getTimeSpent(
                    notification.createdAt
                  )}`}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    case "ACCEPT_CLOSE_DEBATE":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("Debate", {
              setHomeDebates,
              currentUser,
              navigation,
              debate: notification.debate,
            });
          }}
        >
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
                  {`${i18n._("acceptCloseDebate")} ${getTimeSpent(
                    notification.createdAt
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
            </View>
          </View>
        </TouchableOpacity>
      );
    case "REJECT_CLOSE_DEBATE":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("Debate", {
              setHomeDebates,
              currentUser,
              navigation,
              debate: notification.debate,
            });
          }}
        >
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
                  {`${i18n._("rejectCloseDebate")} ${getTimeSpent(
                    notification.createdAt
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
            </View>
          </View>
        </TouchableOpacity>
      );
    case "ACCEPT_DELETE_DEBATE":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("Profile", {
              setHomeDebates,
              currentUser,
              navigation,
              userId: notification.who[0].email,
            });
          }}
        >
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
                  {`${i18n._("acceptDeleteDebate")} ${getTimeSpent(
                    notification.createdAt
                  )}`}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    case "REJECT_DELETE_DEBATE":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("Debate", {
              setHomeDebates,
              currentUser,
              navigation,
              debate: notification.debate,
            });
          }}
        >
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
                  {`${i18n._("rejectDeleteDebate")} ${getTimeSpent(
                    notification.createdAt
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
            </View>
          </View>
        </TouchableOpacity>
      );
    case "COMMENT":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("Debate", {
              setHomeDebates,
              currentUser,
              navigation,
              debate: notification.debate,
            });
          }}
        >
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
              source={{
                uri:
                  notification.who[notification.who.length - 1].profilePicture,
              }}
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
                {`${notification.who[notification.who.length - 1].firstname} ${
                  notification.who[notification.who.length - 1].lastname
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
                  } ${getTimeSpent(notification.updatedAt)}`}
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
        </TouchableOpacity>
      );
    case "SUBCOMMENT":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("IsolateComment", {
              setHomeDebates,
              currentUser,
              navigation,
              comment: notification.comment,
            });
          }}
        >
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
              source={{
                uri:
                  notification.who[notification.who.length - 1].profilePicture,
              }}
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
                {`${notification.who[notification.who.length - 1].firstname} ${
                  notification.who[notification.who.length - 1].lastname
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
                      ? i18n._("answerYourCommentPlural")
                      : i18n._("answerYourCommentSingular")
                  } ${getTimeSpent(notification.updatedAt)}`}
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
        </TouchableOpacity>
      );
    case "CLOSE_DEBATE":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("Debate", {
              setHomeDebates,
              currentUser,
              navigation,
              debate: notification.debate,
            });
          }}
        >
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
                    notification.createdAt
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
                    notifyDebateAction({
                      variables: {
                        userId: notification.who[0].id,
                        currentUserId: currentUser.id,
                        debateId: notification.debate.id,
                        type: "REJECT_CLOSE_DEBATE",
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
        </TouchableOpacity>
      );
    case "DELETE_DEBATE":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("Debate", {
              setHomeDebates,
              currentUser,
              navigation,
              debate: notification.debate,
            });
          }}
        >
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
                  {` ${i18n._("askToDeleteThisDebate")} ${getTimeSpent(
                    notification.createdAt
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
                    deleteDebate({
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
                    notifyDebateAction({
                      variables: {
                        userId: notification.who[0].id,
                        currentUserId: currentUser.id,
                        debateId: notification.debate.id,
                        type: "REJECT_DELETE_DEBATE",
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
        </TouchableOpacity>
      );
    case "LIKE":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("IsolateComment", {
              setHomeDebates,
              currentUser,
              navigation,
              comment: notification.comment,
            });
          }}
        >
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
              source={{
                uri:
                  notification.who[notification.who.length - 1].profilePicture,
              }}
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
                {`${notification.who[notification.who.length - 1].firstname} ${
                  notification.who[notification.who.length - 1].lastname
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
                  } ${getTimeSpent(notification.updatedAt)}`}
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
        </TouchableOpacity>
      );

    case "DISLIKE":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("IsolateComment", {
              setHomeDebates,
              currentUser,
              navigation,
              comment: notification.comment,
            });
          }}
        >
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
              source={{
                uri:
                  notification.who[notification.who.length - 1].profilePicture,
              }}
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
                {`${notification.who[notification.who.length - 1].firstname} ${
                  notification.who[notification.who.length - 1].lastname
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
                  } ${getTimeSpent(notification.updatedAt)}`}
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
        </TouchableOpacity>
      );
    case "FOLLOW":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("Profile", {
              setHomeDebates,
              currentUser,
              navigation,
              userId: notification.who[0].email,
            });
          }}
        >
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
                  {`${i18n._("followingYou")} ${getTimeSpent(
                    notification.createdAt
                  )}`}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    case "CROWNED":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("CreateDebate");
          }}
        >
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
                  {`${i18n._("sendYouCrown")} ${getTimeSpent(
                    notification.createdAt
                  )}`}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  marginTop: 5,
                  fontFamily: "Montserrat_500Medium",
                  color: themeSchema[theme].colorText,
                }}
              >
                {i18n._("crownDescription")}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    case "TOP_COMMENT":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("IsolateComment", {
              setHomeDebates,
              currentUser,
              navigation,
              comment: notification.comment,
            });
          }}
        >
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
              source={{
                uri: notification.who[0].profilePicture,
              }}
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
                  {`${i18n._("topCommentNotification")} ${getTimeSpent(
                    notification.createdAt
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
                {notification.comment.content}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    case "WON_DEBATE":
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.push("IsolateComment", {
              setHomeDebates,
              currentUser,
              navigation,
              debate: notification.debate,
            });
          }}
        >
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
                  {`${i18n._("wonDebateNotification")} ${getTimeSpent(
                    notification.createdAt
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
            </View>
          </View>
        </TouchableOpacity>
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
