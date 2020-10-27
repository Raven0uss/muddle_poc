import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { withTheme, Button, Card, Title, Paragraph } from "react-native-paper";
import { useQuery, gql } from "@apollo/client";
import Icon from "../Components/Icon";
import { Trans } from "@lingui/macro";
import i18n from "../i18n";

import Header from "../Components/Header";

const GET_USERS = gql`
  query {
    users {
      pseudo
      email
    }
  }
`;

function HomeComponent(props) {
  const { navigation } = props;
  const { colors } = props.theme;
  // const { data, loading, error } = useQuery(GET_USERS);

  // if (error) {
  //   console.error("error", error);
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.name}>Error</Text>
  //     </View>
  //   );
  // }
  // if (loading) {
  //   return (
  //     <SafeAreaView style={styles.loadingContainer}>
  //       <ActivityIndicator />
  //     </SafeAreaView>
  //   );
  // }
  // const { users } = data;
  return (
    <View style={styles.container}>
      <Header
        // hidden
        LeftComponent={
          <TouchableHighlight
            onPress={() => {
              navigation.push("Test");
            }}
          >
            <Icon name="gavel" size={24} color={colors.primary} />
          </TouchableHighlight>
        }
        MiddleComponent={<Icon name="gavel" size={24} color={colors.primary} />}
        RightComponent={<Icon name="gavel" size={24} color={colors.primary} />}
      />
      <Card>
        <Card.Title title="Card Title" subtitle="Card Subtitle" />
        <Card.Content>
          <Title>
            <Trans>Test</Trans>
          </Title>
          <Paragraph>{i18n._("test2")}</Paragraph>
        </Card.Content>
        <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
        <Card.Actions>
          <Button>Cancel</Button>
          <Button
            onPress={() => {
              navigation.push("Test");
            }}
          >
            Ok
          </Button>
        </Card.Actions>
      </Card>
      <Icon name="gavel" size={24} color={colors.primary} />
      {/* {users.map((user) => (
        <View style={styles.profileContainer} key={user.pseudo}>
          <View style={styles.details}>
            <Text style={styles.name}>{user.pseudo}</Text>
            <Text style={styles.username}>{user.email}</Text>
          </View>
        </View>
      ))} */}
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
    // justifyContent: "center",
    // paddingHorizontal: 50,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
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
});

export default withTheme(HomeComponent);
