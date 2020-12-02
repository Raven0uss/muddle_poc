import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import CustomIcon from "./Icon";
import Select from "../Components/Select";

const InteractionBox = (props) => {
  const { interaction, navigation } = props;

  return (
    <View
      style={{
        width: "100%",
        borderRadius: 10,
        backgroundColor: "#fff",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 13,
        marginBottom: 10, // android
        padding: 15,
      }}
    >
      <Text>{interaction.type}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  userPicture: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  pseudo: {
    marginLeft: 9,
    fontWeight: "bold",
    fontSize: 14,
    // paddingTop: 6,
  },
  headDebate: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
});

export default InteractionBox;
