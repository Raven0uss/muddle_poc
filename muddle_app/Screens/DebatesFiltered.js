import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";
import { useQuery, gql } from "@apollo/client";
import DebateBox from "../Components/DebateBox";

const GET_DEBATES = gql`
  query($first: Int!, $skip: Int, $filter: DebateType) {
    debates(first: $first, skip: $skip, where: { type: $filter }) {
      id
      content
      type
      owner {
        id
        pseudo
      }
      ownerBlue {
        id
        pseudo
      }
      ownerRed {
        id
        pseudo
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
        from {
          pseudo
        }
        content
        likes {
          id
        }
        dislikes {
          id
        }
      }
    }
  }
`;

const frequency = 20;
let nbDebates = frequency;

const renderItem = ({ item }, navigation) => {
  return <DebateBox debate={item} navigation={navigation} />;
};

const applyFilter = ({ debates, debateType }) => {
  if (debateType === "DUO")
    return debates.filter((debate) => debate.type === "DUO");
  if (debateType === "MUDDLE")
    return debates.filter((debate) => debate.type === "MUDDLE");
  if (debateType === "BEST_DEBATES")
    return debates.filter((debate) => debate.type === "STANDARD");
  return debates;
};

const DebatesFiltered = (props) => {
  const [debates, setDebates] = React.useState([]);
  const [debateType, setDebateType] = React.useState("DUO");

  const { data, loading, error, fetchMore } = useQuery(GET_DEBATES, {
    variables: {
      first: nbDebates,
      ...(debateType === "BEST_DEBATES"
        ? { filter: "STANDARD" }
        : { filter: debateType }),
    },
    onCompleted: (response) => {
      const { debates: queryResult } = response;
      setDebates(queryResult);
    },
  });

  const { navigation, route } = props;

  if (debates.length === 0 && loading) {
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
          backgroundColor: "#F7F7F7",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          paddingTop: 33,
          flexDirection: "row",
        }}
      >
        <ScrollView
          horizontal
          style={{ height: 60 }}
          persistentScrollbar={false}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            style={
              debateType === "BEST_DEBATES"
                ? styles.buttonActivate
                : styles.buttonDefaultState
            }
            onPress={() => setDebateType("BEST_DEBATES")}
          >
            <Text style={styles.buttonTextDefaultState}>
              Les meilleurs debats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              debateType === "DUO"
                ? styles.buttonActivate
                : styles.buttonDefaultState
            }
            onPress={() => {
              setDebateType("DUO");
            }}
          >
            <Text style={styles.buttonTextDefaultState}>Les debats en duo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              debateType === "MUDDLE"
                ? styles.buttonActivate
                : styles.buttonDefaultState
            }
            onPress={() => {
              setDebateType("MUDDLE");
            }}
          >
            <Text style={styles.buttonTextDefaultState}>
              Les debats generes
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={applyFilter({ debates, debateType })}
        style={styles.seedContainer}
        renderItem={(param) => renderItem(param, navigation)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F47658",
  },
  seedContainer: {
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
    backgroundColor: "#F7F7F7",
    paddingLeft: 15,
    paddingRight: 15,
  },
  buttonDefaultState: {
    borderStyle: "solid",
    borderWidth: 2,
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    borderRadius: 40,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonActivate: {
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#F47658",
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    borderRadius: 40,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#F47658",
  },
  buttonTextDefaultState: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default withTheme(DebatesFiltered);
