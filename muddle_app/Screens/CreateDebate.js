import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";

const CreateDebate = (props) => {
  const { navigation, route } = props;
  return (
    <View style={styles.container}>
      <Header
        LeftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CustomIcon name={"chevron-left"} size={38} />
          </TouchableOpacity>
        }
      />
      <ScrollView style={styles.seedContainer}></ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F47658",
  },
  seedContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#F7F7F7",
    paddingLeft: 15,
    paddingRight: 15,
  },
});

export default withTheme(CreateDebate);
