import React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from "react-native";
import { withTheme } from "react-native-paper";
import { muddle } from "../CustomProperties/IconsBase64";

const CreateDebateButton = (props) => {
  const { navigation } = props;

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        navigation.push("CreateDebate");
      }}
    >
      <Image
        source={{
          uri: muddle.nb_create,
        }}
        style={styles.iconButton}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginBottom: 60,
    justifyContent: "center",
    alignItems: "center",
    width: 69,
    height: 74,
    backgroundColor: "#F47658",
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
  },
  iconButton: {
    width: 48,
    height: 22,
    marginLeft: 10,
  },
});

export default withTheme(CreateDebateButton);
