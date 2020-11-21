import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";

const Debate = (props) => {
  const { navigation, debate, route } = props;

  console.log(route.params.debate);
  return (
    <View style={styles.container}>
      <Header hidden />
      <View
        style={{
          height: 50,
          backgroundColor: "#FFFFFF",
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 3 }}
        >
          <CustomIcon name={"chevron-left"} size={38} />
        </TouchableOpacity>
      </View>
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
    backgroundColor: "#F7F7F7",
    paddingLeft: 15,
    paddingRight: 15,
  },
});

export default withTheme(Debate);
