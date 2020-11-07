import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import { defaultProfile, muddle } from "../CustomProperties/IconsBase64";
import DebateBox from "../Components/DebateBox";

const user = {
  profilePicture: defaultProfile,
};

const Home = () => {
  return (
    <View style={styles.container}>
      <Header
        LeftComponent={
          <TouchableOpacity>
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.profilePicture}
            />
          </TouchableOpacity>
        }
        MiddleComponent={
          <Image source={{ uri: muddle.nb }} style={styles.logo} />
        }
      />
      <ScrollView style={styles.seedContainer}>
        {new Array(50).fill(null).map(() => (
          <DebateBox />
        ))}
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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#F7F7F7",
    paddingTop: 60,
    paddingLeft: 15,
    paddingRight: 15,
  },
  profilePicture: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  logo: {
    width: 50,
    height: 50,
  },
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

export default withTheme(Home);
