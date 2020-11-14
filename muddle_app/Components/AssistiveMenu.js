import React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";
import { Easing } from "react-native-reanimated";
import Icon from "./Icon";

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

const AssistiveMenu = (props) => {
  const [deploy, setDeploy] = React.useState(false);

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

  const { navigation, route } = props;

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

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        onDeploy(200);
      }}
    >
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
                if (route.name !== "Chat") navigation.push("Chat");
              }}
            >
              <Icon name="chat" size={28} />
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
                right: 0,
                marginRight: 10,
                marginTop: -25,
              }}
              onPress={() => {
                onDeploy(200);
                if (route.name !== "Notifications")
                  navigation.push("Notifications");
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
              <Icon name="menu" size={32} />
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
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
