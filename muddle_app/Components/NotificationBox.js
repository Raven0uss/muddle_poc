import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import CustomIcon from "./Icon";
import Select from "../Components/Select";
import { not } from "react-native-reanimated";

const notificationText = {
  VOTE: "a vote sur votre debat",
  INVITATION_DUO: "vous invite a un debat duo",
};

const NotificationBox = (props) => {
  const [status, setStatus] = React.useState(props.notification.status);
  const { notification } = props;

  //   console.log(notification);

  switch (notification.type) {
    case "VOTE":
      return (
        <View
          style={{
            width: "90%",
            borderRadius: 10,
            backgroundColor: "#f7f7f7",
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
          <Image source={{ uri: defaultProfile }} style={styles.userPicture} />
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
              }}
            >
              {notification.who[0].pseudo}
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
                }}
              >
                a vote sur votre debat{" "}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
                }}
              >
                il y a 2 heures
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
            backgroundColor: "#f7f7f7",
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
          <Image source={{ uri: defaultProfile }} style={styles.userPicture} />
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
              }}
            >
              {notification.who[0].pseudo}
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
                }}
              >
                vous invite pour un debat duo{" "}
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
                  backgroundColor: "#fff",
                  width: 100,
                  borderRadius: 12,
                }}
                disabled={status === "DECLINED"}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                  }}
                >
                  Accepter
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: status === "DECLINED" ? "#000" : "#fff",
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
                    color: status === "DECLINED" ? "#fff" : "#000",
                    fontFamily: "Montserrat_500Medium",
                  }}
                >
                  Refuser
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
            backgroundColor: "#f7f7f7",
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
          <Image source={{ uri: defaultProfile }} style={styles.userPicture} />
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
              }}
            >
              {`${notification.who[0].pseudo}${
                notification.who.length > 1
                  ? ` et ${notification.who.length - 1} ${
                      notification.who.length - 1 > 1
                        ? "autres personnes"
                        : "autre personne"
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
                }}
              >
                {`${
                  notification.who.length > 1
                    ? "ont commente votre debat"
                    : "a commente votre debat"
                }`}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
                }}
              >
                {" il y a 2 jours"}
              </Text>
            </View>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 12,
                marginTop: 5,
                fontFamily: "Montserrat_500Medium",
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
            backgroundColor: "#f7f7f7",
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
          <Image source={{ uri: defaultProfile }} style={styles.userPicture} />
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
              }}
            >
              {notification.who[0].pseudo}
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
                }}
              >
                a demande a clore ce debat{" "}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
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
                  backgroundColor: "#fff",
                  width: 100,
                  borderRadius: 12,
                }}
                disabled={status === "DECLINED"}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                  }}
                >
                  Accepter
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: status === "DECLINED" ? "#000" : "#fff",
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
                    color: status === "DECLINED" ? "#fff" : "#000",
                    fontFamily: "Montserrat_500Medium",
                  }}
                >
                  Refuser
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
            backgroundColor: "#f7f7f7",
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
          <Image source={{ uri: defaultProfile }} style={styles.userPicture} />
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
              }}
            >
              {`${notification.who[0].pseudo}${
                notification.who.length > 1
                  ? ` et ${notification.who.length - 1} ${
                      notification.who.length - 1 > 1
                        ? "autres personnes"
                        : "autre personne"
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
                }}
              >
                {`${
                  notification.who.length > 1
                    ? "ont aime votre commentaire"
                    : "a aime votre commentaire"
                }`}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
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
            backgroundColor: "#f7f7f7",
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
          <Image source={{ uri: defaultProfile }} style={styles.userPicture} />
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
              }}
            >
              {`${notification.who[0].pseudo}${
                notification.who.length > 1
                  ? ` et ${notification.who.length - 1} ${
                      notification.who.length - 1 > 1
                        ? "autres personnes"
                        : "autre personne"
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
                }}
              >
                {`${
                  notification.who.length > 1
                    ? "n'ont pas aime votre commentaire"
                    : "n'a pas aime votre commentaire"
                }`}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Montserrat_500Medium",
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
    borderColor: "black",
    borderWidth: 1,
  },
});

export default NotificationBox;
