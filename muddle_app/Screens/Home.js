import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  SectionList,
  VirtualizedList,
  RefreshControl,
} from "react-native";
import Header from "../Components/Header";
import { debates_logo, muddle } from "../CustomProperties/IconsBase64";
import DebateBox from "../Components/DebateBox";
import { useQuery, gql, useSubscription, useMutation } from "@apollo/client";
import AssistiveMenu from "../Components/AssistiveMenu";
import { flatten, isEmpty, last, get, isNil } from "lodash";
import CreateDebateButton from "../Components/CreateDebateButton";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import UserContext from "../CustomProperties/UserContext";
import wait from "../Library/wait";
import useEffectUpdate from "../Library/useEffectUpdate";
import { isBlocked, isBlockingMe } from "../Library/isBlock";
import isFollowing from "../Library/isFollowing";
import AdBox from "../Components/AdBox";

import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

const GET_DEBATES = gql`
  query($first: Int!, $skip: Int) {
    homeDebates(first: $first, skip: $skip) {
      id
      content
      createdAt
      answerOne
      answerTwo
      image
      type
      crowned
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
  }
`;

const NOTIFICATIONS_SUB = gql`
  subscription($userId: String!) {
    notification(userId: $userId) {
      node {
        id
      }
    }
  }
`;

const MESSAGES_SUB = gql`
  subscription($userId: String!) {
    message(userId: $userId) {
      node {
        id
      }
    }
  }
`;

const CONVERSATIONS_SUB = gql`
  subscription($userId: String!) {
    conversation(userId: $userId) {
      node {
        id
      }
    }
  }
`;

const GET_ADS = gql`
  query {
    ads(orderBy: ratio_DESC, where: { active: true }) {
      id
      name
      company
      companyIcon
      content
      image
      link
      active
      ratio
    }
  }
`;

const REFRESH_PUSH_TOKEN = gql`
  mutation($userId: ID!, $pushToken: String!) {
    checkPushToken(userId: $userId, pushToken: $pushToken) {
      id
    }
  }
`;

async function registerForPushNotificationsAsync() {
  console.log("test");
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  console.log(finalStatus);
  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return null;
  }

  // Get the token that uniquely identifies this device
  const pushNotificiationToken = await Notifications.getExpoPushTokenAsync();
  console.log(pushNotificiationToken);
  return pushNotificiationToken;
}

const frequency = 20;
let nbDebates = frequency;

const pubFrequency = 8;

const getPubIndex = (index, adLength) => {
  let result = index;
  const limit = adLength * pubFrequency;
  while (result > limit) {
    result = result - limit;
  }
  result = result / pubFrequency - 1;
  return result;
};

const renderItem = (
  { item, index },
  navigation,
  currentUser,
  setDebates,
  ads
) => {
  if (!isEmpty(ads) && index % pubFrequency === 0 && index !== 0) {
    const pubIndex = getPubIndex(index, ads.length);
    return (
      <>
        <AdBox ad={ads[pubIndex]} />
        <DebateBox
          currentUser={currentUser}
          debate={item}
          navigation={navigation}
          index={index}
          setDebates={setDebates}
        />
      </>
    );
  }
  return (
    <DebateBox
      currentUser={currentUser}
      debate={item}
      navigation={navigation}
      index={index}
      setDebates={setDebates}
    />
  );
};

const Home = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { currentUser, setCurrentUser } = React.useContext(UserContext);

  const [refreshing, setRefreshing] = React.useState(false);

  const [debates, setDebates] = React.useState([]);
  const [ads, setAds] = React.useState([]);
  const [noMoreData, setNoMoreData] = React.useState(false);
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_DEBATES, {
    variables: {
      first: nbDebates,
    },
    onCompleted: (response) => {
      try {
        const { homeDebates: queryResult } = response;
        // console.log("fetch");
        setDebates(queryResult);
        if (queryResult.length === 0) setNoMoreData(true);
      } catch (err) {
        console.log(err);
      }
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    // ssr: false,
    onError: () => {
      setNoMoreData(true);
    },
  });

  useQuery(GET_ADS, {
    onCompleted: (response) => {
      const { ads: queryResponse } = response;
      // console.log(response);
      setAds(queryResponse);
    },
    fetchPolicy: "cache-and-network",
  });
  const scrollViewRef = React.useRef(null);

  const [refreshPushToken] = useMutation(REFRESH_PUSH_TOKEN, {
    onCompleted: (response) => {
      const newPushToken = get(response, "checkPushToken.pushToken");
      if (!isNil(newPushToken)) {
        setCurrentUser((cu) => ({
          ...cu,
          pushToken: newPushToken,
        }));
      }
    },
  });

  React.useEffect(() => {
    const managePushNotificationToken = async () => {
      console.log("managePushNotification");
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken !== null) {
        await refreshPushToken({
          variables: {
            userId: currentUser.id,
            pushToken,
          },
        });
      }
    };

    console.log("useEffect");
    managePushNotificationToken();
  }, []);

  const onRefresh = React.useCallback(async () => {
    nbDebates = frequency;
    setRefreshing(true);
    setDebates([]);
    setNoMoreData(false);
    try {
      await refetch();
    } catch (err) {}
    setRefreshing(false);
  }, []);

  useSubscription(NOTIFICATIONS_SUB, {
    variables: {
      userId: currentUser.id,
    },
    shouldResubscribe: true,
    onSubscriptionData: (response) => {
      console.log("new notification detected");
    },
  });

  useSubscription(MESSAGES_SUB, {
    variables: {
      userId: currentUser.id,
    },
    shouldResubscribe: true,
    onSubscriptionData: (response) => {
      console.log("new message detected");
    },
  });

  useSubscription(CONVERSATIONS_SUB, {
    variables: {
      userId: currentUser.id,
    },
    shouldResubscribe: true,
    onSubscriptionData: (response) => {
      console.log("new conversation detected");
    },
  });

  // themeSchema[theme]

  const { navigation, route } = props;

  // console.log(route.params);

  // console.log(currentUser);
  // console.log(debates.length);

  // if (error) {
  //   console.error("error", error);
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.name}>Error</Text>
  //     </View>
  //   );
  // }
  // useEffectUpdate(() => {

  // }, [debates]);

  // console.log(currentUser);

  if (debates.length === 0 && !refreshing && loading) {
    return (
      <SafeAreaView
        style={{
          ...styles.loadingContainer,
          backgroundColor: themeSchema[theme].backgroundColor1,
        }}
      >
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        LeftComponent={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Profile", {
                userId: currentUser.email, // Personne connectee
                setHomeDebates: setDebates,
              });
            }}
          >
            <Image
              source={{
                uri: get(currentUser, "profilePicture", ""),
              }}
              style={styles.profilePicture}
            />
          </TouchableOpacity>
        }
        MiddleComponent={
          <Image
            source={{ uri: muddle.nb }}
            style={{
              width: 50,
              height: 28,
              marginTop: 8,
              marginLeft: -10,
            }}
          />
        }
        RightComponent={
          <TouchableOpacity
            onPress={() =>
              navigation.push("DebatesFiltered", {
                setHomeDebates: setDebates,
              })
            }
          >
            <Image
              source={{ uri: debates_logo }}
              style={{
                width: 32,
                height: 32,
                marginTop: 6,
              }}
            />
          </TouchableOpacity>
        }
      />
      <FlatList
        ref={scrollViewRef}
        data={debates.filter((d) => {
          if (d.type === "DUO") {
            if (
              currentUser.id === d.ownerRed.id ||
              currentUser.id === d.ownerBlue.id ||
              d.ownerBlue.role === "MUDDLE" ||
              d.ownerRed.role === "MUDDLE"
            )
              return true;
            if (
              isBlocked({ currentUser, userId: d.ownerRed.id }) ||
              isBlocked({ currentUser, userId: d.ownerBlue.id })
            )
              return false;
            if (
              isBlockingMe({ currentUser, userId: d.ownerRed.id }) ||
              isBlockingMe({ currentUser, userId: d.ownerBlue.id })
            )
              return false;
            if (
              (d.ownerRed.private && !isFollowing(d.ownerRed, currentUser)) ||
              (d.ownerRed.private && !isFollowing(d.ownerRed, currentUser))
            )
              return false;
          } else {
            if (currentUser.id === d.owner.id || d.owner.role === "MUDDLE")
              return true;
            if (
              isBlockingMe({ currentUser, userId: d.owner.id }) ||
              isBlocked({ currentUser, userId: d.owner.id })
            )
              return false;
            if (d.owner.private && !isFollowing(d.owner, currentUser))
              return false;
          }
          return true;
        })}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: themeSchema[theme].backgroundColor1,
          paddingTop: 60,
          paddingLeft: 15,
          paddingRight: 15,
        }}
        renderItem={(param) =>
          renderItem(param, navigation, currentUser, setDebates, ads)
        }
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.5}
        onEndReached={async () => {
          if (Platform.OS === "web" || noMoreData) return;
          // return ;
          nbDebates += frequency;
          await fetchMore({
            variables: { first: frequency, skip: nbDebates - frequency },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const { homeDebates: moreDebates } = fetchMoreResult;
              if (isEmpty(moreDebates)) return setNoMoreData(true);
              setDebates((previousState) =>
                [...previousState, ...moreDebates].reduce((acc, current) => {
                  const x = acc.find((item) => item.id === current.id);
                  if (!x) {
                    return acc.concat([current]);
                  } else {
                    return acc;
                  }
                }, [])
              );
            },
          });
        }}
        ListFooterComponent={() => {
          if (noMoreData || refreshing)
            return <View style={{ height: 50, width: 10 }} />;
          return <ActivityIndicator style={{ marginBottom: 70 }} />;
        }}
      />
      <AssistiveMenu
        navigation={navigation}
        route={route}
        scrollViewRef={scrollViewRef}
      />
      <CreateDebateButton navigation={navigation} />
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
    // backgroundColor: "white",
    // marginBottom: 20
  },
  seedContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#F7F7F7",
    paddingTop: 60,
    paddingLeft: 15,
    paddingRight: 15,
    // paddingBottom: 60,
  },
  profilePicture: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },
  logo: {
    width: 50,
    height: 28,
    marginTop: 8,
    marginLeft: -38,
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

export default Home;
