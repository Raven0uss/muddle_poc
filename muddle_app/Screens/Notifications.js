import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";
import { useQuery, gql } from "@apollo/client";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import NotificationBox from "../Components/NotificationBox";
import { isEmpty } from "lodash";

const GET_NOTIFICATIONS = gql`
  query($first: Int!, $skip: Int) {
    notifications(first: $first, skip: $skip) {
      id
      who {
        id
        pseudo
      }
      type
      status
      new
      debate {
        id
        content
      }
      comment {
        id
        content
      }
    }
  }
`;

const frequency = 10;
let nbNotifications = frequency;

const renderItem = ({ item }, navigation) => {
  return <NotificationBox notification={item} />;
};

const Notifications = (props) => {
  const [notifications, setNotifications] = React.useState([]);
  const [noMoreData, setNoMoreData] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const { data, loading, error, fetchMore } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      first: nbNotifications,
    },
    onCompleted: (response) => {
      const { notifications: queryResult } = response;
      setNotifications(queryResult);
    },
  });

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
          backgroundColor: "#FFF",
        }}
      >
        <TextInput
          placeholder="Rechercher une notification"
          value={search}
          style={{
            width: Dimensions.get("screen").width / 1.15,
            height: 40,
            borderRadius: 10,
            backgroundColor: "#f7f7f7",
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
      <FlatList
        data={notifications}
        style={styles.seedContainer}
        renderItem={(param) => renderItem(param, navigation)}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.5}
        onEndReached={async () => {
          if (Platform.OS === "web" || noMoreData) return;
          // return ;
          nbNotifications += frequency;
          await fetchMore({
            variables: { first: frequency, skip: nbNotifications - frequency },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const { notifications: moreNotifications } = fetchMoreResult;
              if (isEmpty(moreNotifications)) setNoMoreData(true);
              setNotifications((previousState) =>
                [...previousState, ...moreNotifications].reduce(
                  (acc, current) => {
                    const x = acc.find((item) => item.id === current.id);
                    if (!x) {
                      return acc.concat([current]);
                    } else {
                      return acc;
                    }
                  },
                  []
                )
              );
            },
          });
        }}
        ListFooterComponent={() => {
          if (noMoreData) return null;
          return <ActivityIndicator style={{ marginBottom: 70 }} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F47658",
  },
  seedContainer: {
    backgroundColor: "#FFF",
    paddingLeft: 15,
    paddingRight: 15,
  },
});

export default withTheme(Notifications);
