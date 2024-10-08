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
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";
import { useQuery, gql, useMutation } from "@apollo/client";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import NotificationBox from "../Components/NotificationBox";
import { get, isEmpty } from "lodash";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import UserContext from "../CustomProperties/UserContext";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";

const GET_NOTIFICATIONS = gql`
  query($first: Int!, $skip: Int, $userId: String!) {
    notifications(
      orderBy: createdAt_DESC
      first: $first
      skip: $skip
      where: { userId: $userId }
    ) {
      id
      createdAt
      updatedAt
      who {
        id
        certified
        firstname
        lastname
        email
        profilePicture
      }
      type
      status
      new
      debate {
        id
        content
        createdAt
        answerOne
        answerTwo
        image
        type
        crowned
        timelimitString
        owner {
          id
          certified
          firstname
          lastname
          email
          profilePicture
          private
          role
          followers {
            id
          }
        }
        ownerBlue {
          id
          firstname
          certified
          lastname
          email
          profilePicture
          private
          role
          followers {
            id
          }
        }
        ownerRed {
          id
          firstname
          certified
          lastname
          email
          profilePicture
          private
          role
          followers {
            id
          }
        }
        positives {
          id
        }
        negatives {
          id
        }
        redVotes {
          id
        }
        blueVotes {
          id
        }
        comments {
          id
        }
        closed
      }
      comment {
        id
        debate {
          id
          closed
        }
        nested
        from {
          id
          certified
          firstname
          lastname
          email
          profilePicture
        }
        content
        likes {
          id
        }
        dislikes {
          id
        }
        comments {
          id
        }
        updatedAt
      }
    }
  }
`;

const NOTIFICATIONS_UPDATE_VIEW = gql`
  mutation($userId: String!) {
    updateManyNotifications(
      where: { userId: $userId, new: true }
      data: { new: false }
    ) {
      count
    }
  }
`;

const DELETE_NOTIFICATIONS = gql`
  mutation($userId: String!) {
    deleteManyNotifications(where: { status_not: PENDING, userId: $userId }) {
      count
    }
  }
`;

const frequency = 10;
let nbNotifications = frequency;

const renderItem = (
  { item },
  navigation,
  theme,
  currentUser,
  setHomeDebates
) => {
  return (
    <NotificationBox
      theme={theme}
      notification={item}
      navigation={navigation}
      currentUser={currentUser}
      setHomeDebates={setHomeDebates}
    />
  );
};

const Notifications = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);
  const [notifications, setNotifications] = React.useState([]);
  const [noMoreData, setNoMoreData] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_NOTIFICATIONS,
    {
      variables: {
        first: nbNotifications,
        userId: currentUser.id,
      },
      onCompleted: (response) => {
        const { notifications: queryResult } = response;
        setNotifications(queryResult);
        markAsReadNotifcations();

        if (queryResult.length === 0) setNoMoreData(true);
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const [markAsReadNotifcations] = useMutation(NOTIFICATIONS_UPDATE_VIEW, {
    variables: {
      userId: currentUser.id,
    },
  });

  const [deleteAllNotifications] = useMutation(DELETE_NOTIFICATIONS, {
    variables: {
      userId: currentUser.id,
    },
    onCompleted: () => {
      nbNotifications = frequency;
      setNotifications((visiblesNotifs) =>
        visiblesNotifs.filter((n) => n.status === "PENDING")
      );
    },
  });

  const isFocused = useIsFocused();
  React.useEffect(() => {
    refetch();
    // markAsReadNotifcations();
  }, [isFocused]);

  const { navigation, route } = props;

  const setHomeDebates = get(route, "params.setHomeDebates");
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
              marginLeft: 0,
              marginBottom: 10,
            }}
          />
        }
        RightComponent={
          <TouchableOpacity
            onPress={async () => {
              await deleteAllNotifications();
            }}
            style={{ marginTop: 3 }}
          >
            <CustomIcon name={"delete"} size={38} />
          </TouchableOpacity>
        }
      />
      <View
        style={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: themeSchema[theme].backgroundColor2,
          height: 30,
        }}
      >
        {/* <TextInput
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
        /> */}
      </View>
      <FlatList
        data={notifications}
        style={{
          ...styles.seedContainer,
          backgroundColor: themeSchema[theme].backgroundColor2,
        }}
        renderItem={(param) =>
          renderItem(param, navigation, theme, currentUser, setHomeDebates)
        }
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
              if (isEmpty(moreNotifications)) return setNoMoreData(true);
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

export default Notifications;
