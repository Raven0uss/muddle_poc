import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { withTheme, Button, Card, Title, Paragraph } from "react-native-paper";
import { useQuery, gql } from "@apollo/client";

const GET_USERS = gql`
  query {
    users {
      name
    }
  }
`;

function HomeComponent(props) {
  const { colors } = props.theme;
  const { data, loading, error } = useQuery(GET_USERS);

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

  const { users } = data;
  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title="Card Title" subtitle="Card Subtitle" />
        <Card.Content>
          <Title>Card title</Title>
          <Paragraph>Card content</Paragraph>
        </Card.Content>
        <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
        <Card.Actions>
          <Button>Cancel</Button>
          <Button>Ok</Button>
        </Card.Actions>
      </Card>
      {users.map((user) => (
        <View style={styles.profileContainer} key={user.name}>
          {/* <Image source={{ uri: user.profile_image_url }} style={styles.image} />  */}
          <View style={styles.details}>
            <Text style={styles.name}>{user.name}</Text>
            {/* <Text style={styles.username}>{user.email}</Text> */}
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

export default withTheme(HomeComponent);
