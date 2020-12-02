import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";
import { useQuery, gql } from "@apollo/client";
import AssistiveMenu from "../Components/AssistiveMenu";
import CreateDebateButton from "../Components/CreateDebateButton";
import TrophyBox from "../Components/TrophyBox";
import { get, isEmpty } from "lodash";

const GET_TROPHIES = gql`
  query($first: Int!, $skip: Int, $userId: String!) {
    trophies(where: { user: { pseudo: $userId } }, first: $first, skip: $skip) {
      id
      user {
        id
        pseudo
      }
      type
      debate {
        id
        content
        comments {
          id
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
      }
      comment {
        id
        content
        from {
          id
          pseudo
        }
        debate {
          id
          content
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
        }
      }
    }
  }
`;

const frequency = 10;
let nbTrophies = frequency;

const renderItem = ({ item }, navigation) => {
  return <TrophyBox trophy={item} navigation={navigation} />;
};

const Trophies = (props) => {
  const [trophies, setTrophies] = React.useState([]);
  const [search, setSearch] = React.useState("");

  const { data, loading, error, fetchMore } = useQuery(GET_TROPHIES, {
    variables: {
      first: nbTrophies,
      userId: get(props, "route.params.userId", "userA"),
    },
    onCompleted: (response) => {
      const { trophies: queryResult } = response;
      setTrophies(queryResult);
    },
  });

  const { navigation, route } = props;
  const { userId, nbTopComment, nbDuoTrophies } = route.params;
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
            source={{ uri: muddle.trophies_light }}
            style={{
              width: 40,
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
          placeholder="Rechercher"
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
              width: Dimensions.get("screen").width / 2,
            }}
          >
            <Text style={{ fontSize: 12 }}>Debat en duo remporte</Text>
            <Text
              style={{ fontSize: 14, color: "#6AE686", fontWeight: "bold" }}
            >
              {nbDuoTrophies}
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              width: Dimensions.get("screen").width / 2,
            }}
          >
            <Text style={{ fontSize: 12 }}>Commentaires remportes</Text>
            <Text
              style={{ fontSize: 14, color: "#F5D65A", fontWeight: "bold" }}
            >
              {nbTopComment}
            </Text>
          </View>
        </View>
      </View>
      <FlatList
        data={trophies}
        style={styles.seedContainer}
        renderItem={(param) => renderItem(param, navigation)}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.5}
        onEndReached={async () => {
          if (Platform.OS === "web") return;
          // return ;
          nbInteractions += frequency;
          await fetchMore({
            variables: {
              first: frequency,
              skip: nbTrophies - frequency,
              userId,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const { trophies: moreTrophies } = fetchMoreResult;
              setInteractions((previousState) =>
                [...previousState, ...moreTrophies].reduce((acc, current) => {
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
      <CreateDebateButton navigation={navigation} />
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

export default withTheme(Trophies);
