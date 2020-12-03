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
import { withTheme } from "react-native-paper";
import Header from "../Components/Header";
import {
  defaultCover,
  debates_logo,
  coverTest,
  defaultProfile,
} from "../CustomProperties/IconsBase64";
import CustomIcon from "../Components/Icon";
import { ScrollView } from "react-native-gesture-handler";
import AssistiveMenu from "../Components/AssistiveMenu";
import CreateDebateButton from "../Components/CreateDebateButton";
import InteractionBox from "../Components/InteractionBox";
import { muddle } from "../CustomProperties/IconsBase64";
import UserContext from "../CustomProperties/UserContext";
import { useQuery, gql } from "@apollo/client";
import { get, isEmpty } from "lodash";

const GET_USER = gql`
  query($userId: String!) {
    user(where: { pseudo: $userId }) {
      id
      pseudo
      trophies {
        id
        type
      }
      followers {
        id
      }
      following {
        id
      }
    }
  }
`;

const GET_INTERACTIONS = gql`
  query($first: Int!, $skip: Int, $userId: String!) {
    interactions(
      where: { who: { pseudo: $userId } }
      first: $first
      skip: $skip
    ) {
      id
      type
      who {
        id
        pseudo
      }
      debate {
        id
        type
        content
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
        }
      }
      comment {
        id
        debate {
          id
          id
          type
          content
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
          }
        }
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

const frequency = 10;
let nbInteractions = frequency;

const renderItem = ({ item }, navigation, user) => {
  return (
    <InteractionBox interaction={item} navigation={navigation} user={user} />
  );
};

const Interactions = (props) => {
  const [interactions, setInteractions] = React.useState([]);
  const [noMoreData, setNoMoreData] = React.useState(false);
  const { data, loading, error, fetchMore } = useQuery(GET_INTERACTIONS, {
    variables: {
      first: nbInteractions,
      userId: props.userId,
    },
    onCompleted: (response) => {
      const { interactions: queryResult } = response;
      setInteractions(queryResult);
    },
  });

  const { navigation, userId } = props;

  if (interactions.length === 0 && loading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={interactions}
      style={styles.seedContainer}
      renderItem={(param) => renderItem(param, navigation, userId)}
      keyExtractor={(item) => item.id}
      onEndReachedThreshold={0.5}
      onEndReached={async () => {
        if (Platform.OS === "web" || noMoreData) return;
        // return ;
        nbInteractions += frequency;
        await fetchMore({
          variables: {
            first: frequency,
            skip: nbInteractions - frequency,
            userId,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const { interactions: moreInteractions } = fetchMoreResult;
            if (isEmpty(moreInteractions)) setNoMoreData(true);
            setInteractions((previousState) =>
              [...previousState, ...moreInteractions].reduce((acc, current) => {
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
        if (noMoreData) return null;
        return <ActivityIndicator style={{ marginBottom: 70 }} />;
      }}
    />
  );
};

const Profile = (props) => {
  const [user, setUser] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const { data, loading, error, fetchMore } = useQuery(GET_USER, {
    variables: {
      userId: get(props, "route.params.userId", "userA"),
    },
    onCompleted: (response) => {
      const { user: queryResult } = response;
      setUser(queryResult);
    },
  });

  const { navigation, route } = props;

  if (user === null || loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      <Image
        source={{
          uri: coverTest,
        }}
        style={{
          height: 240,
          width: Dimensions.get("screen").width,
          position: "absolute",
        }}
        resizeMode="cover"
      />
      <Header
        LeftComponent={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              marginTop: 3,
              borderRadius: 50,
              backgroundColor: "rgba(255, 255, 255, 0.6)",
            }}
          >
            <CustomIcon name={"chevron-left"} size={38} />
          </TouchableOpacity>
        }
        RightComponent={
          <TouchableOpacity
            onPress={() => navigation.push("DebatesFiltered")}
            style={{
              //   marginTop: 3,
              borderRadius: 50,
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              marginTop: 6,
              width: 38,
              height: 38,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: debates_logo }}
              style={{
                width: 32,
                height: 32,
              }}
            />
          </TouchableOpacity>
        }
      />

      {/* Cadre Profil */}
      <View
        style={{
          width: Dimensions.get("screen").width / 1.2,
          height: 100,
          borderRadius: 30,
          backgroundColor: "#FFFFFF",
          marginTop: 110,
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: 20,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            width: 50,
            height: 52,
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            borderColor: "#F47658",
            borderStyle: "solid",
            borderWidth: 2,
            // marginLeft: "auto",
            right: 0,
            bottom: 0,
            marginRight: -10,
            // marginTop: "auto",
            marginBottom: -10,
            justifyContent: "center",
            alignItems: "center",
            elevation: 20,
            zIndex: 20,
          }}
          onPress={() =>
            navigation.navigate("Trophies", {
              userId: user.pseudo,
              nbDuoTrophies: user.trophies.filter((t) => t.type === "DUO")
                .length,
              nbTopComment: user.trophies.filter(
                (t) => t.type === "TOP_COMMENT"
              ).length,
            })
          }
        >
          <Text
            style={{
              fontSize: 10,
              marginTop: -3,
              marginBottom: 3,
              fontWeight: "bold",
            }}
          >
            {user.trophies.length}
          </Text>
          <Image
            source={{
              uri: muddle.trophies_light, // Have to be dynamic par rapport au theme
            }}
            style={{
              width: 30,
              height: 22,
            }}
          />
          {/* Nombre des trophees */}
        </TouchableOpacity>
        <Image
          source={{
            uri: defaultProfile,
          }}
          style={{
            width: 90,
            height: 90,
            borderRadius: 30,
            // borderWidth: 1,
            marginTop: "auto",
            marginBottom: "auto",
            padding: 5,
            marginLeft: 5,
          }}
          resizeMode="center"
        />

        <View
          style={{
            marginLeft: 20,
            marginTop: 13,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              width: 150,
              height: 40,

              // borderWidth: 1,
            }}
            numberOfLines={2}
          >
            {user.pseudo}
          </Text>

          <View
            style={{
              flexDirection: "row",
              width: 145,
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              >
                {user.followers.length}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: "#A3A3A3",
                }}
              >
                abonnes
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              >
                {user.following.length}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: "#A3A3A3",
                }}
              >
                abonnements
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 12,
            marginLeft: 10,
          }}
        >
          <CustomIcon name={"more-horiz"} size={22} />
        </TouchableOpacity>
      </View>

      {/* Historique des interactions */}
      <TextInput
        placeholder="Rechercher dans le profil"
        value={search}
        style={{
          width: Dimensions.get("screen").width / 1.15,
          height: 40,
          borderRadius: 10,
          backgroundColor: "#fff",
          marginLeft: "auto",
          marginRight: "auto",
          padding: 10,
          paddingLeft: 20,
          paddingRight: 20,
          marginBottom: 14,
        }}
        keyboardType="default"
        onChangeText={(s) => setSearch(s)}
        // placeholderTextColor="#222"
      />
      <Interactions userId={user.pseudo} navigation={navigation} />
      <AssistiveMenu navigation={navigation} route={route} />
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
});

export default withTheme(Profile);
