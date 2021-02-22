import React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { Easing } from "react-native-reanimated";
import Icon from "./Icon";
import { gql, useQuery } from "@apollo/client";
import Badge from "./Badge";
import { useIsFocused } from "@react-navigation/native";
import { get } from "lodash";
import { setBadgeCountAsync } from "expo-notifications";

const properties = {
  borderRadius: {
    deployed: 30,
    undeployed: 50,
  },
  borderTopRadius: {
    deployed: 150,
    undeployed: 50,
  },
  borderWidth: {
    deployed: 5,
    undeployed: 19,
  },
  width: {
    deployed: 136,
    undeployed: 66,
  },
  height: {
    deployed: 86,
    undeployed: 66,
  },
};

properties.left = {
  deployed: (Dimensions.get("screen").width - properties.width.deployed) / 2,
  undeployed:
    (Dimensions.get("screen").width - properties.width.undeployed) / 2,
};

const GET_NEW_NOTIFICATIONS = gql`
  query {
    newNotifications {
      notifications
      messages
    }
  }
`;

let timer = undefined;
const AssistiveMenu = (props) => {
  const [newNotifications, setNewNotifications] = React.useState({
    messages: 0,
    notifications: 0,
  });
  const [deploy, setDeploy] = React.useState(false);

  const { loading, error, refetch } = useQuery(GET_NEW_NOTIFICATIONS, {
    onCompleted: (response) => {
      const { newNotifications: queryResponse } = response;

      setNewNotifications(queryResponse);
      const messagesN = get(queryResponse, "messages", 0);
      const notificationsN = get(queryResponse, "notifications", 0);
      if (Platform.OS === "ios") setBadgeCountAsync(messagesN + notificationsN);
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    pollInterval: 10000,
  });

  const [borderTopRadiusButton] = React.useState(
    new Animated.Value(
      properties.borderTopRadius[deploy ? "deployed" : "undeployed"]
    )
  );
  const [borderRadiusButton] = React.useState(
    new Animated.Value(
      properties.borderRadius[deploy ? "deployed" : "undeployed"]
    )
  );
  const [widthButton] = React.useState(
    new Animated.Value(properties.width[deploy ? "deployed" : "undeployed"])
  );
  const [heightButton] = React.useState(
    new Animated.Value(properties.height[deploy ? "deployed" : "undeployed"])
  );
  const [borderWidthButton] = React.useState(
    new Animated.Value(
      properties.borderWidth[deploy ? "deployed" : "undeployed"]
    )
  );
  const [leftButton] = React.useState(
    new Animated.Value(properties.left[deploy ? "deployed" : "undeployed"])
  );

  React.useEffect(() => {
    if (deploy === true) {
      timer = setTimeout(() => {
        if (deploy) onDeploy(200);
      }, 3000);
    } else {
      if (timer !== undefined) clearTimeout(timer);
    }

    return () => {
      if (timer !== undefined) clearTimeout(timer);
      if (deploy) onDeploy;
    };
  }, [deploy]);

  const { navigation, route, scrollViewRef } = props;
  const setHomeDebates = get(props, "setHomeDebates");

  const isFocused = useIsFocused();
  React.useEffect(() => {
    refetch();
  }, [isFocused]);

  const deployButtonAnimation = (duration) => {
    Animated.timing(borderTopRadiusButton, {
      toValue: properties.borderTopRadius.deployed,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(widthButton, {
      toValue: properties.width.deployed,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(heightButton, {
      toValue: properties.height.deployed,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(borderWidthButton, {
      toValue: properties.borderWidth.deployed,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(borderRadiusButton, {
      toValue: properties.borderRadius.deployed,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(leftButton, {
      toValue: properties.left.deployed,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const undeployButtonAnimation = (duration) => {
    Animated.timing(borderRadiusButton, {
      toValue: properties.borderRadius.undeployed,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(borderTopRadiusButton, {
      toValue: properties.borderTopRadius.undeployed,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(widthButton, {
      toValue: properties.width.undeployed,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(heightButton, {
      toValue: properties.height.undeployed,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(borderWidthButton, {
      toValue: properties.borderWidth.undeployed,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    Animated.timing(leftButton, {
      toValue: properties.left.undeployed,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const onDeploy = (duration) => {
    if (!deploy) deployButtonAnimation(duration);
    else undeployButtonAnimation(duration);
    setDeploy((previousState) => !previousState);
  };

  // console.log(newNotifications);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        onDeploy(200);
      }}
    >
      {/* <> */}
      <Animated.View
        style={[
          styles.buttonMenu,
          {
            borderRadius: borderRadiusButton,
            borderTopLeftRadius: borderTopRadiusButton,
            borderTopRightRadius: borderTopRadiusButton,
            width: widthButton,
            height: heightButton,
            borderWidth: borderWidthButton,
            left: leftButton,
          },
        ]}
      >
        {deploy === false &&
          (newNotifications.notifications > 0 ||
            newNotifications.messages > 0) && (
            <Badge
              nb={newNotifications.messages + newNotifications.notifications}
              // nb={104}
              viewStyle={{
                backgroundColor: "#F47658",
                position: "absolute",
                borderColor: "#ffffff",
                borderWidth: 1,
                // right: 0,
                marginLeft: 25,
                width: 26,
                height: 26,
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
                marginTop: -23,
                // zIndex: 10000,
                // elevation: 10
              }}
            />
          )}
        {deploy && (
          <>
            <TouchableOpacity
              style={{
                position: "absolute",
                borderRadius: 50,
                backgroundColor: "#F47658",
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
                bottom: 0,
                marginLeft: -30,
                marginBottom: 15,
              }}
              onPress={() => {
                onDeploy(200);
                if (route.name !== "Home") navigation.push("Home");
                else {
                  if (scrollViewRef.current) {
                    scrollViewRef.current.scrollToIndex({
                      animated: true,
                      index: 0,
                    });
                  }
                }
              }}
            >
              <Icon name="home" size={32} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                position: "absolute",
                borderRadius: 50,
                backgroundColor: "#F47658",
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
                // bottom: 0,
                marginLeft: 10,
                marginTop: -25,
              }}
              onPress={() => {
                onDeploy(200);
                if (route.name !== "Search") navigation.push("Search");
              }}
            >
              <Icon name="search" size={32} />
            </TouchableOpacity>
            {deploy === true && (
              // && newNotifications.messages > 0
              <TouchableOpacity
                style={{
                  zIndex: 100,
                }}
                onPress={() => {
                  onDeploy(200);
                  if (route.name !== "Conversations")
                    navigation.push("Conversations");
                }}
              >
                <Badge
                  nb={newNotifications.messages}
                  viewStyle={{
                    backgroundColor: "#F47658",
                    position: "absolute",
                    borderColor: "#fff",
                    borderWidth: 1,
                    // right: 0,
                    marginLeft: 142,
                    width: 24,
                    height: 24,
                    borderRadius: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 12,
                    // elevation: 10
                  }}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                position: "absolute",
                borderRadius: 50,
                backgroundColor: "#F47658",
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
                bottom: 0,
                right: 0,
                marginRight: -30,
                marginBottom: 15,
              }}
              onPress={() => {
                onDeploy(200);
                if (route.name !== "Conversations")
                  navigation.push("Conversations");
              }}
            >
              <Icon name="chat" size={28} />
            </TouchableOpacity>
            {deploy === true && newNotifications.notifications > 0 && (
              <TouchableOpacity
                style={{
                  zIndex: 100,
                }}
                onPress={() => {
                  onDeploy(200);
                  if (route.name !== "Conversations")
                    navigation.push("Conversations");
                }}
              >
                <Badge
                  nb={newNotifications.notifications}
                  viewStyle={{
                    backgroundColor: "#F47658",
                    position: "absolute",
                    borderColor: "#fff",
                    borderWidth: 1,
                    // right: 0,
                    marginLeft: 100,
                    width: 24,
                    height: 24,
                    borderRadius: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: -30,
                    // elevation: 10
                  }}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                position: "absolute",
                borderRadius: 50,
                backgroundColor: "#F47658",
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
                // bottom: 0,
                right: 0,
                marginRight: 10,
                marginTop: -25,
              }}
              onPress={() => {
                onDeploy(200);
                if (route.name !== "Notifications")
                  navigation.push("Notifications", {
                    setHomeDebates,
                  });
              }}
            >
              <Icon name="notifications" size={32} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                position: "absolute",
                borderRadius: 50,
                backgroundColor: "#F47658",
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                bottom: 5,
                // right: 30,
                marginRight: 10,
                marginTop: -25,
              }}
              onPress={() => {
                onDeploy(200);
                if (route.name !== "Menu") navigation.push("Menu");
              }}
            >
              <Icon name="settings" size={28} />
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
      {/* </> */}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  buttonMenu: {
    position: "absolute",
    zIndex: 100,
    backgroundColor: "transparent",
    // width: 66,
    // height: 66,
    // borderRadius: 50,
    borderColor: "#F47658",
    borderStyle: "solid",
    // borderWidth: 19,
    bottom: 0,
    marginBottom: 40,
    // left: (Dimensions.get("screen").width - 66) / 2,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "#F47658",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  buttonDeploy: {
    position: "absolute",
    zIndex: 100,
    backgroundColor: "transparent",
    width: 126,
    height: 86,
    borderRadius: 20,
    borderTopRightRadius: 80,
    borderTopLeftRadius: 80,
    borderColor: "#F47658",
    borderStyle: "solid",
    borderWidth: 5,
    bottom: 0,
    marginBottom: 40,
    left: (Dimensions.get("screen").width - 126) / 2,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "#F47658",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
});

export default AssistiveMenu;
