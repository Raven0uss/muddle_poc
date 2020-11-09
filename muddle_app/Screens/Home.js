import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import { defaultProfile, muddle } from "../CustomProperties/IconsBase64";
import DebateBox from "../Components/DebateBox";
import { useQuery, gql } from "@apollo/client";
import AssistiveMenu from "../Components/AssistiveMenu";

const user = {
  profilePicture: defaultProfile,
};

const GET_DEBATES = gql`
  query {
    debates(first: 20) {
      id
      content
      type
      owner {
        id
        pseudo
      }
      positives {
        id
      }
      negatives {
        id
      }
      comments {
        id
      }
    }
  }
`;

const Home = () => {
  const { data, loading, error } = useQuery(GET_DEBATES);

  if (error) {
    console.error("error", error);
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Error</Text>
      </View>
    );
  }
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }
  const { debates } = data;

  console.log(debates);
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
      <ScrollView
        contentInset={{
          bottom: 60,
        }}
        style={styles.seedContainer}
        onScroll={(event) => {
          console.log(event.nativeEvent);
        }}
        scrollEventThrottle={1}
      >
        {debates.map((debate) => (
          <DebateBox debate={debate} />
        ))}
      </ScrollView>
      <AssistiveMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F47658",
    // marginBottom: 20
  },
  seedContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#F7F7F7",
    paddingTop: 60,
    paddingLeft: 15,
    paddingRight: 15,
    // paddingBottom: 130,
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
