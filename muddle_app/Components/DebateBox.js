import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DebateBox = () => {
  return (
    <View style={styles.boxDebate}>
      <Text style={{ fontSize: 12 }}>Test</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  boxDebate: {
    height: 248,
    backgroundColor: "white",
    elevation: 10,
    borderRadius: 7,
    padding: 10,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "gray",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 20,
  },
});

export default DebateBox;
