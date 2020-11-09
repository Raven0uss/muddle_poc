import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

const AssistiveMenu = (props) => {
  return (
    <TouchableOpacity style={styles.container}>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 100,
    backgroundColor: "transparent",
    width: 66,
    height: 66,
    borderRadius: 50,
    borderColor: "#F47658",
    borderStyle: "solid",
    borderWidth: 19,
    bottom: 0,
    marginBottom: 40,
    left: (Dimensions.get("screen").width - 66) / 2,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "#F47658",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
});

export default AssistiveMenu;
