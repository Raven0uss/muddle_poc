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
    deployed: 4,
    undeployed: 19,
  },
  width: {
    deployed: 136,
    undeployed: 66,
  },
  height: {
    deployed: 106,
    undeployed: 66,
  },
};

properties.left = {
  deployed: (Dimensions.get("screen").width - properties.width.deployed) / 2,
  undeployed:
    (Dimensions.get("screen").width - properties.width.undeployed) / 2,
};

const AssistiveMenu = (props) => {
  const [borderTopRadiusButton] = React.useState(new Animated.Value(50));
  const [borderRadiusButton] = React.useState(new Animated.Value(50));
  const [widthButton] = React.useState(new Animated.Value(66));
  const [heightButton] = React.useState(new Animated.Value(66));
  const [borderWidthButton] = React.useState(new Animated.Value(19));
  const [leftButton] = React.useState(
    new Animated.Value(
      (Dimensions.get("screen").width - (deploy ? 126 : 66)) / 2
    )
  );

  const [deploy, setDeploy] = React.useState(false);

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

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        const duration = 200;
        if (!deploy) deployButtonAnimation(duration);
        else undeployButtonAnimation(duration);
        setDeploy((previousState) => !previousState);
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
            <TouchableOpacity>
              <Text>Test</Text>
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
