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
import { muddle } from "../CustomProperties/IconsBase64";

const Notifications = (props) => {
  const [search, setSearch] = React.useState("");

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
              marginLeft: -32,
              marginBottom: 10,
            }}
          />
        }
      />
      <View
        style={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: "#F7F7F7",
        }}
      >
        <TextInput
          placeholder="Rechercher une notification"
          value={search}
          style={{
            width: Dimensions.get("screen").width / 1.15,
            height: 40,
            borderRadius: 10,
            backgroundColor: "#fff",
            marginLeft: "auto",
            marginRight: "auto",
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 14,
            marginTop: 33,
            marginBottom: 35,
          }}
          keyboardType="default"
          onChangeText={(s) => setSearch(s)}
        />
      </View>
      <ScrollView style={styles.seedContainer}>
        <View
          style={{
            width: Dimensions.get("screen").width / 1.15,
            height: 100,
            borderRadius: 10,
            backgroundColor: "#fff",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        ></View>
      </ScrollView>
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

export default withTheme(Notifications);
