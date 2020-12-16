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
import { useQuery, gql } from "@apollo/client";
import { get, isEmpty } from "lodash";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import UserContext from "../CustomProperties/UserContext";
import ProfileAction from "../Components/ProfileAction";
import useEffectUpdate from "../Library/useEffectUpdate";
import { useIsFocused } from "@react-navigation/native";

const GET_USER = gql`
  query($userId: String!) {
    user(where: { email: $userId }) {
      id
      firstname
      lastname
      profilePicture
      coverPicture
      email
      trophies {
        id
        type
      }
      followers {
        id
        firstname
        lastname
        email
        profilePicture
        trophies {
          id
          type
        }
      }
      following {
        id
        firstname
        lastname
        email
        profilePicture
        trophies {
          id
          type
        }
      }
    }
  }
`;

const GET_INTERACTIONS = gql`
  query($first: Int!, $skip: Int, $userId: String!) {
    interactions(
      where: { who: { email: $userId } }
      first: $first
      skip: $skip
    ) {
      id
      type
      who {
        id
        email
        firstname
        lastname
        profilePicture
      }
      debate {
        id
        type
        answerOne
        answerTwo
        content
        owner {
          id
          email
          firstname
          lastname
          profilePicture
        }
        ownerBlue {
          id
          email
          firstname
          lastname
          profilePicture
        }
        ownerRed {
          id
          email
          firstname
          lastname
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
      comment {
        id
        nested
        debate {
          id
          type
          content
          answerOne
          answerTwo
          owner {
            id
            profilePicture
            firstname
            lastname
            email
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
        from {
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
      }
    }
  }
`;

const fakeSetDebates = (callback) => callback();

const frequency = 3;
let nbInteractions = frequency;

const renderItem = ({ item }, navigation, user, theme, setHomeDebates) => {
  return (
    <InteractionBox
      theme={theme}
      interaction={item}
      navigation={navigation}
      user={user}
      setDebates={null}
      setHomeDebates={setHomeDebates}
    />
  );
};

const Interactions = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const [interactions, setInteractions] = React.useState([]);
  const [noMoreData, setNoMoreData] = React.useState(false);
  const { loading, error, fetchMore, refetch } = useQuery(GET_INTERACTIONS, {
    variables: {
      first: nbInteractions,
      userId: props.userId,
    },
    onCompleted: (response) => {
      const { interactions: queryResult } = response;
      setInteractions(queryResult);
      if (queryResult.length === 0) setNoMoreData(true);
    },
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
  });

  const isFocused = useIsFocused();
  React.useEffect(() => {
    nbInteractions = frequency;
    const reloadInteractions = async () => {
      setInteractions([]);
      refetch();
      return true;
    };
    reloadInteractions();
  }, [isFocused]);

  const { navigation, userId, setHomeDebates } = props;

  if (interactions.length === 0 && loading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={interactions}
      style={{
        ...styles.seedContainer,
        backgroundColor: themeSchema[theme].backgroundColor1,
      }}
      renderItem={(param) =>
        renderItem(param, navigation, userId, theme, setHomeDebates)
      }
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
  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);
  const [user, setUser] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const { data, loading, error, fetchMore } = useQuery(GET_USER, {
    variables: {
      userId: get(props, "route.params.userId"),
    },
    onCompleted: (response) => {
      const { user: queryResult } = response;
      setUser(queryResult);
    },
  });

  const { navigation, route } = props;
  const { setHomeDebates } = route.params;

  if (user === null || loading) {
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

  const me = currentUser.id === user.id;
  return (
    <View
      style={{ flex: 1, backgroundColor: themeSchema[theme].backgroundColor1 }}
    >
      <Image
        source={{
          uri: user.coverPicture,
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
            onPress={() =>
              navigation.push("DebatesFiltered", {
                setHomeDebates,
              })
            }
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
          backgroundColor: themeSchema[theme].backgroundColor2,
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
            backgroundColor: themeSchema[theme].backgroundColor2,
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
            navigation.push("Trophies", {
              userId: user.email,
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
              fontFamily: "Montserrat_600SemiBold",
              color: themeSchema[theme].colorText,
            }}
          >
            {user.trophies.length}
          </Text>
          <Image
            source={{
              uri:
                theme === "light"
                  ? muddle.trophies_light
                  : muddle.trophies_dark,
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
            uri: user.profilePicture,
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
          // resizeMode="center"
        />

        <View
          style={{
            marginLeft: 20,
            marginTop: 13,
          }}
        >
          <Text
            style={{
              width: 150,
              height: 40,
              fontFamily: "Montserrat_700Bold",
              // borderWidth: 1,
              color: themeSchema[theme].colorText,
            }}
            numberOfLines={2}
          >
            {`${user.firstname} ${user.lastname}`}
          </Text>

          <View
            style={{
              flexDirection: "row",
              width: 145,
              justifyContent: "space-between",
            }}
          >
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.push("Follow", {
                    follow: {
                      following: user.following,
                      followers: user.followers,
                    },
                    selected: "followers",
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Montserrat_600SemiBold",
                    color: themeSchema[theme].colorText,
                  }}
                >
                  {user.followers.length}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: "#A3A3A3",
                    fontFamily: "Montserrat_500Medium",
                  }}
                >
                  {i18n._("followers").toLowerCase()}
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.push("Follow", {
                    follow: {
                      following: user.following,
                      followers: user.followers,
                    },
                    selected: "following",
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Montserrat_600SemiBold",
                    color: themeSchema[theme].colorText,
                  }}
                >
                  {user.following.length}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: "#A3A3A3",
                    fontFamily: "Montserrat_500Medium",
                  }}
                >
                  {i18n._("following").toLowerCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 12,
            marginLeft: 10,
          }}
        >
          <ProfileAction
            me={me}
            navigation={navigation}
            theme={theme}
            user={user}
          />
        </View>
      </View>

      {/* Historique des interactions */}
      {/* <TextInput
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
      /> */}
      <Interactions
        userId={user.email}
        navigation={navigation}
        setHomeDebates={setHomeDebates}
      />
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

export default Profile;
