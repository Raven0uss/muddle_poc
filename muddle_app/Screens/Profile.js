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
  badges,
} from "../CustomProperties/IconsBase64";
import CustomIcon from "../Components/Icon";
import { ScrollView } from "react-native-gesture-handler";
import AssistiveMenu from "../Components/AssistiveMenu";
import CreateDebateButton from "../Components/CreateDebateButton";
import InteractionBox from "../Components/InteractionBox";
import DebateBox from "../Components/DebateBox";
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
import CertifiedIcon from "../Components/CertifiedIcon";
import GET_DEBATES from "../gql/getDebates";
import { isBlocked, isBlockingMe } from "../Library/isBlock";
import isFollowing from "../Library/isFollowing";

const formatFollow = (nb) => {
  if (nb < 1000) return `${nb}`;
  if (nb >= 1000 && nb < 1000000) {
    const k = parseFloat(`${nb / 1000}`).toFixed(1);
    return `${k}k`;
  } else if (nb >= 1000000 && nb < 1000000000) {
    const m = parseFloat(`${nb / 1000000}`).toFixed(1);
    return `${m}M`;
  } else if (nb >= 1000000000) {
    const mrd = parseFloat(`${nb / 1000000000}`).toFixed(1);
    return `${mrd} Mrd`;
  }
};

const calculateTrophyPoints = (trophies) => {
  let points = 0;
  trophies.map((t) => {
    if (t.type === "DUO") points += 10;
    else points += 5;
  });
  return formatFollow(points);
};

const GET_USER = gql`
  query($userId: String!, $currentUserId: ID!) {
    user(where: { email: $userId }) {
      id
      firstname
      certified
      lastname
      profilePicture
      coverPicture
      email
      private
      crowned
      role
      conversations(where: { speakers_some: { id: $currentUserId } }) {
        id
        speakers {
          id
          firstname
          lastname
          profilePicture
          certified
          email
        }
      }
      trophies {
        id
        type
      }
      followers {
        id
        firstname
        lastname
        email
        certified
        profilePicture
        trophies {
          id
          type
        }
      }
      following {
        id
        firstname
        certified
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

const GET_OWNER_DEBATES = GET_DEBATES("OWNER_DEBATES");

const GET_INTERACTIONS = gql`
  query($first: Int!, $skip: Int, $userId: String!) {
    interactions(
      where: { who: { email: $userId } }
      first: $first
      skip: $skip
      orderBy: updatedAt_DESC
    ) {
      id
      type
      updatedAt
      createdAt
      who {
        id
        email
        firstname
        certified
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
          certified
          firstname
          lastname
          profilePicture
        }
        ownerBlue {
          id
          email
          certified
          firstname
          lastname
          profilePicture
        }
        ownerRed {
          id
          email
          certified
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
            certified
            firstname
            lastname
            email
          }
          ownerBlue {
            id
            firstname
            certified
            lastname
            email
            profilePicture
          }
          ownerRed {
            id
            firstname
            lastname
            certified
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
      }
    }
  }
`;

// const fakeSetDebates = (callback) => callback();

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
    fetchPolicy: "cache-and-network",
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
        // marginTop: 0,
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
            if (isEmpty(moreInteractions)) return setNoMoreData(true);
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

const renderItemDebates = (
  { item },
  navigation,
  theme,
  currentUser,
  setHomeDebates
) => {
  return (
    <View style={{ paddingLeft: 15, paddingRight: 15 }}>
      <DebateBox
        currentUser={currentUser}
        theme={theme}
        debate={item}
        navigation={navigation}
        setDebates={null}
        setHomeDebates={setHomeDebates}
      />
    </View>
  );
};

let nbDebates = frequency;
const OwnerDebates = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);
  const [debates, setDebates] = React.useState([]);
  const [noMoreData, setNoMoreData] = React.useState(false);
  const { loading, error, fetchMore, refetch } = useQuery(GET_OWNER_DEBATES, {
    variables: {
      first: nbDebates,
      userId: props.userId,
    },
    onCompleted: (response) => {
      const { ownerDebates: queryResult } = response;
      setDebates(queryResult);
      if (queryResult.length === 0) setNoMoreData(true);
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const isFocused = useIsFocused();
  React.useEffect(() => {
    nbDebates = frequency;
    const reloadDebates = async () => {
      setDebates([]);
      refetch();
      return true;
    };
    reloadDebates();
  }, [isFocused]);

  const { navigation, userId, setHomeDebates } = props;

  if (debates.length === 0 && loading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={debates}
      style={{
        ...styles.seedContainer,
        backgroundColor: themeSchema[theme].backgroundColor1,
      }}
      renderItem={(param) =>
        renderItemDebates(param, navigation, theme, currentUser, setHomeDebates)
      }
      keyExtractor={(item) => item.id}
      onEndReachedThreshold={0.5}
      onEndReached={async () => {
        if (Platform.OS === "web" || noMoreData) return;
        // return ;
        nbDebates += frequency;
        await fetchMore({
          variables: {
            first: frequency,
            skip: nbDebates - frequency,
            userId,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const { debates: moreDebates } = fetchMoreResult;
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
  // const [search, setSearch] = React.useState("");
  const [vision, setVision] = React.useState("votes");
  const [loadingPicture, setLoadingPicture] = React.useState(false);
  const { data, loading, error, fetchMore } = useQuery(GET_USER, {
    variables: {
      userId: get(props, "route.params.userId"),
      currentUserId: currentUser.id,
    },
    onCompleted: (response) => {
      const { user: queryResult } = response;
      console.log(response);
      setUser(queryResult);
    },
    onError: (err) => {
      console.log(err);
    },
    fetchPolicy: "cache-and-network",
  });

  const { navigation, route } = props;
  const { setHomeDebates } = route.params;

  console.log(get(props, "route.params.userId"));
  console.log(loading);
  console.log(loadingPicture);
  if (user === null || loading || loadingPicture) {
    return (
      <SafeAreaView
        style={{
          ...styles.loadingContainer,
          backgroundColor: themeSchema[theme].backgroundColor1,
        }}
      >
        <ActivityIndicator />
        {loadingPicture && (
          <Text
            style={{
              marginTop: 10,
              fontFamily: "Montserrat_600SemiBold",
              color: "#a7a7a7",
              textAlign: "center",
            }}
          >
            {i18n._("loadingPictureMessage")}
          </Text>
        )}
      </SafeAreaView>
    );
  }

  const me = currentUser.id === user.id;
  // console.log(user.trophies);
  console.log("wesh");
  return (
    <View
      style={{ flex: 1, backgroundColor: themeSchema[theme].backgroundColor1 }}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
        }}
        onPress={() => {
          navigation.push("IsolateImage", {
            image: user.coverPicture,
          });
        }}
      >
        <Image
          source={{
            uri: user.coverPicture,
          }}
          style={{
            height: 240,
            width: Dimensions.get("screen").width,
          }}
          resizeMode="cover"
        />
      </TouchableOpacity>
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
        {user.role !== "MUDDLE" && (
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
            onPress={() => {
              if (
                user.id === currentUser.id ||
                ((!user.private || isFollowing(user, currentUser)) &&
                  !isBlocked({ currentUser, userId: user.id }) &&
                  !isBlockingMe({ currentUser, userId: user.id }))
              )
                navigation.push("Trophies", {
                  userId: user.email,
                  nbDuoTrophies: user.trophies.filter((t) => t.type === "DUO")
                    .length,
                  nbTopComment: user.trophies.filter(
                    (t) => t.type === "TOP_COMMENT"
                  ).length,
                });
            }}
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
              {calculateTrophyPoints(user.trophies)}
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
        )}
        <TouchableOpacity
          onPress={() => {
            navigation.push("IsolateImage", {
              image: user.profilePicture,
            });
          }}
        >
          {user.crowned && (
            <View
              style={{
                position: "absolute",
                zIndex: 100,
                width: 20,
                height: 20,
                backgroundColor: "#F47658",
                right: 0,
                marginTop: 5,
                // marginLeft: 10,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: themeSchema[theme].backgroundColor2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={{ uri: badges.crown }}
                style={{
                  width: 10,
                  height: 8,
                }}
              />
            </View>
          )}
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
        </TouchableOpacity>

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
            {`${user.firstname}${
              user.role !== "MUDDLE" ? ` ${user.lastname}` : ""
            }`}
            {user.certified && <CertifiedIcon />}
          </Text>
          {user.role === "MUDDLE" && (
            <View
              style={{
                marginTop: -10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat_400Regular",
                  fontSize: 10,
                  width: Dimensions.get("screen").width / 2.1,
                }}
              >
                {i18n._("muddleAccountDesc")}
              </Text>
            </View>
          )}
          {user.role !== "MUDDLE" && (
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
                    if (
                      user.id === currentUser.id ||
                      ((!user.private || isFollowing(user, currentUser)) &&
                        !isBlocked({ currentUser, userId: user.id }) &&
                        !isBlockingMe({ currentUser, userId: user.id }))
                    )
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
                    {formatFollow(user.followers.length)}
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
                    if (
                      user.id === currentUser.id ||
                      ((!user.private || isFollowing(user, currentUser)) &&
                        !isBlocked({ currentUser, userId: user.id }) &&
                        !isBlockingMe({ currentUser, userId: user.id }))
                    )
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
                    {formatFollow(user.following.length)}
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
          )}
        </View>

        <View
          style={{
            marginLeft: "auto",
            // alignSelf: "flex-end",
            marginTop: 13,
            marginRight: 5,
            // marginLeft: 17,
          }}
        >
          {isBlockingMe({ userId: user.id, currentUser }) === false &&
            user.role !== "MUDDLE" && (
              <ProfileAction
                me={me}
                navigation={navigation}
                theme={theme}
                user={user}
                setLoadingPicture={setLoadingPicture}
              />
            )}
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
      {user.role === "MUDDLE" && (
        <OwnerDebates
          userId={user.id}
          navigation={navigation}
          setHomeDebates={setHomeDebates}
        />
      )}
      {user.role !== "MUDDLE" &&
      (user.id === currentUser.id ||
        ((!user.private || isFollowing(user, currentUser)) &&
          !isBlocked({ currentUser, userId: user.id }) &&
          !isBlockingMe({ currentUser, userId: user.id }))) ? (
        <>
          <View
            style={{
              backgroundColor: "transparent",
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              paddingLeft: 15,
              paddingRight: 15,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: Dimensions.get("screen").width / 1.5,
                backgroundColor: themeSchema[theme].backgroundColor2,
                height: 30,
                borderRadius: 40,
                marginTop: -10,
                marginBottom: 5,
                flexDirection: "row",
                borderWidth: 1,
                borderColor: themeSchema[theme].backgroundColor2,
              }}
            >
              <TouchableOpacity
                style={{
                  width: "50%",
                  backgroundColor:
                    vision === "votes"
                      ? "#F47658"
                      : themeSchema[theme].backgroundColor2,
                  borderRadius: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  setVision("votes");
                  nbInteractions = frequency;
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 10,
                    color: themeSchema[theme].colorText,
                  }}
                >
                  {currentUser.id === user.id
                    ? i18n._("yourVotesProfile")
                    : i18n._("votesProfile")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    vision === "debates"
                      ? "#F47658"
                      : themeSchema[theme].backgroundColor2,
                  borderRadius: 40,
                }}
                onPress={() => {
                  setVision("debates");
                  nbDebates = frequency;
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 10,
                    color: themeSchema[theme].colorText,
                  }}
                >
                  {currentUser.id === user.id
                    ? i18n._("yourDebatesProfile")
                    : i18n._("debatesProfile")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {vision === "votes" && (
            <Interactions
              userId={user.email}
              navigation={navigation}
              setHomeDebates={setHomeDebates}
            />
          )}
          {vision === "debates" && (
            <OwnerDebates
              userId={user.id}
              navigation={navigation}
              setHomeDebates={setHomeDebates}
            />
          )}
        </>
      ) : (
        user.role !== "MUDDLE" && (
          <View
            style={{
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <CustomIcon name="lock" size={108} color="#d3d3d3" />
            <Text
              style={{
                color: "#d3d3d3",
                fontFamily: "Montserrat_600SemiBold",
                fontSize: 12,
                marginTop: 10,
              }}
            >
              {i18n._("messagePrivateProfile")}
            </Text>
          </View>
        )
      )}
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
