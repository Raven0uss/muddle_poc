import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { ApolloProvider, useQuery, gql } from "@apollo/client";

import { apolloClient } from "./apollo";

const GET_USERS = gql`
  query {
    users {
      username
      email
    }
  }
`;

function RootComponent() {
  const { data, loading, error } = useQuery(GET_USERS);

  if (error) {
    console.error("error", error);
  }
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  const { users } = data;
  return (
    <View style={styles.container}>
      {users.map((user) => (
          <View style={styles.profileContainer} key={user.username}>
            {/* <Image source={{ uri: user.profile_image_url }} style={styles.image} />  */}
            <View style={styles.details}>
              <Text style={styles.name}>{user.username}</Text>
              <Text style={styles.username}>{user.email}</Text>
            </View>
          </View>
      ))}
      {/* <View style={styles.tweetContainer}>
        <Text style={styles.tweet}>{tweet.text}</Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  details: {
    marginLeft: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  username: {
    color: "gray",
  },
  tweetContainer: {
    marginTop: 10,
  },
  tweet: {
    fontSize: 16,
  },
});

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <RootComponent />
    </ApolloProvider>
  );
}
