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
} from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import { defaultProfile, muddle } from "../CustomProperties/IconsBase64";
import DebateBox from "../Components/DebateBox";
import { useQuery, gql } from "@apollo/client";
import AssistiveMenu from "../Components/AssistiveMenu";
import { set } from "react-native-reanimated";
import { flatten, last } from "lodash";

const user = {
  profilePicture: defaultProfile,
};

const GET_DEBATES = gql`
  query($first: Int!, $skip: Int) {
    debates(first: $first, skip: $skip) {
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

const frequency = 20;
let nbDebates = frequency;

const renderItem = ({ item }) => {
  return <DebateBox debate={item} />;
};

const Home = (props) => {
  const [debates, setDebates] = React.useState([]);
  // const { data, loading, error, fetchMore, networkStatus } = useQuery(
  //   GET_DEBATES,
  //   {
  //     variables: {
  //       first: nbDebates,
  //     },
  //     onCompleted: (response) => {
  //       const { debates: queryResult } = response;
  //       setDebates(queryResult);
  //     },
  //     // notifyOnNetworkStatusChange: true,
  //   }
  // );

  const { navigation, route } = props;

  console.log(debates.length);

  // if (error) {
  //   console.error("error", error);
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.name}>Error</Text>
  //     </View>
  //   );
  // }
  // if (debates.length === 0 && loading) {
  //   return (
  //     <SafeAreaView style={styles.loadingContainer}>
  //       <Text>wesh</Text>
  //       <ActivityIndicator />
  //     </SafeAreaView>
  //   );
  // }

  // console.log(networkStatus);
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
        // MiddleComponent={
        //   <Image source={{ uri: muddle.nb }} style={styles.logo} />
        // }
      />
      <FlatList
        data={debates}
        style={styles.seedContainer}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.5}
        onEndReached={async () => {
          if (Platform.OS === "web") return;
          // return ;
          nbDebates += frequency;
          await fetchMore({
            variables: { first: frequency, skip: nbDebates - frequency },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const { debates: moreDebates } = fetchMoreResult;
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
        ListFooterComponent={() => (
          <ActivityIndicator style={{ marginBottom: 70 }} />
        )}
      />
      <AssistiveMenu navigation={navigation} route={route} />
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
