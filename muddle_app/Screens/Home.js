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
import {
  debates_logo,
  defaultProfile,
  muddle,
} from "../CustomProperties/IconsBase64";
import DebateBox from "../Components/DebateBox";
import { useQuery, gql, useSubscription } from "@apollo/client";
import AssistiveMenu from "../Components/AssistiveMenu";
import { flatten, isEmpty, last } from "lodash";
import CreateDebateButton from "../Components/CreateDebateButton";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import UserContext from "../CustomProperties/UserContext";
import { get } from "lodash";
import wait from "../Library/wait";

const GET_DEBATES = gql`
  query($first: Int!, $skip: Int) {
    debates(first: $first, skip: $skip) {
      id
      content
      createdAt
      answerOne
      answerTwo
      type
      owner {
        id
        firstname
        lastname
        email
        profilePicture
      }
      ownerBlue {
        id
        firstname
        lastname
        email
        profilePicture
      }
      ownerRed {
        id
        firstname
        lastname
        email
        profilePicture
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

const frequency = 20; //TESTESTEST
let nbDebates = frequency;

const renderItem = ({ item }, navigation) => {
  return <DebateBox debate={item} navigation={navigation} />;
};

const Home = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);

  const [refreshing, setRefreshing] = React.useState(false);

  const [debates, setDebates] = React.useState([]);
  const [noMoreData, setNoMoreData] = React.useState(false);
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_DEBATES, {
    variables: {
      first: nbDebates,
    },
    onCompleted: (response) => {
      const { debates: queryResult } = response;
      console.log("fetch");
      setDebates(queryResult);
      if (queryResult.length === 0) setNoMoreData(true);
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });
  const scrollViewRef = React.useRef(null);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setDebates([]);
    await refetch();
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
      console.log("new conversation detected");
    },
  });

  useSubscription(CONVERSATIONS_SUB, {
    variables: {
      userId: currentUser.id,
    },
    shouldResubscribe: true,
    onSubscriptionData: (response) => {
      console.log("new message detected");
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
  if (debates.length === 0 && !refreshing && loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
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
              });
            }}
          >
            <Image
              source={{
                uri: get(currentUser, "profilePicture", defaultProfile),
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
          <TouchableOpacity onPress={() => navigation.push("DebatesFiltered")}>
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
        data={debates}
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
        renderItem={(param) => renderItem(param, navigation)}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.5}
        onEndReached={async () => {
          if (Platform.OS === "web" || noMoreData) return;
          // return ;
          nbDebates += frequency;
          await fetchMore({
            variables: { first: frequency, skip: nbDebates - frequency },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const { debates: moreDebates } = fetchMoreResult;
              if (isEmpty(moreDebates)) setNoMoreData(true);
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
