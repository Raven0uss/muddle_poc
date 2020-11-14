import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";

const Chat = (props) => {
  const { navigation, route } = props;
  return (
    <View style={styles.container}>
      <Header
        LeftComponent={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: 3 }}
          >
            <CustomIcon name={"chevron-left"} size={38} />
          </TouchableOpacity>
        }
        MiddleComponent={
          <Image
            source={{ uri: muddle.nb }}
            style={{
              width: 50,
              height: 28,
              marginTop: 8,
              marginBottom: 10,
            //   marginLeft: -10,
            }}
          />
        }
        RightComponent={
          <TouchableOpacity
            style={{ marginTop: 5 }}
            onPress={() => navigation.push("NewConversation")}
          >
            <CustomIcon name="add" size={32} />
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

export default withTheme(Chat);
