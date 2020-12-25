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
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";
import { useQuery, gql } from "@apollo/client";
import AssistiveMenu from "../Components/AssistiveMenu";
import CreateDebateButton from "../Components/CreateDebateButton";
import TrophyBox from "../Components/TrophyBox";
import { get, isEmpty } from "lodash";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import UserContext from "../CustomProperties/UserContext";

const GET_TROPHIES = gql`
  query($first: Int!, $skip: Int, $userId: String!) {
    trophies(where: { user: { email: $userId } }, first: $first, skip: $skip) {
      id
      user {
        id
        email
        firstname
        lastname
        profilePicture
      }
      type
      debate {
        id
        type
        content
        answerOne
        answerTwo
        image
        closed
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
        comments {
          id
          nested
          content
          comments {
            id
          }
          from {
            id
            firstname
            lastname
            email
            profilePicture
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
      }
      comment {
        id
        nested
        content
        comments {
          id
          nested
          content
          comments {
            id
          }
          from {
            id
            firstname
            lastname
            email
            profilePicture
          }
        }
        from {
          id
          firstname
          lastname
          email
          profilePicture
        }
        debate {
          id
          type
          answerOne
          answerTwo
          image
          content
          closed
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
            nested
            content
            from {
              id
              firstname
              lastname
              email
              profilePicture
            }
            comments {
              id
            }
          }
        }
      }
    }
  }
`;

const frequency = 10;
let nbTrophies = frequency;

const renderItem = ({ item }, navigation, currentUser) => {
  return (
    <TrophyBox
      currentUser={currentUser}
      trophy={item}
      navigation={navigation}
    />
  );
};

const Trophies = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);
  const [trophies, setTrophies] = React.useState([]);
  const [noMoreData, setNoMoreData] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const { data, loading, error, fetchMore } = useQuery(GET_TROPHIES, {
    variables: {
      first: nbTrophies,
      userId: get(props, "route.params.userId", "userA"),
    },
    onCompleted: (response) => {
      const { trophies: queryResult } = response;
      setTrophies(queryResult);
      if (queryResult.length === 0) setNoMoreData(true);
    },
    fetchPolicy: "cache-and-network",
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
          backgroundColor: themeSchema[theme].backgroundColor2,
          // height: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: 40,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              alignItems: "center",
              width: Dimensions.get("screen").width / 2,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Montserrat_500Medium",
                color: themeSchema[theme].colorText,
              }}
            >
              {i18n._("duoDebatesWon")}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#6AE686",
                fontFamily: "Montserrat_700Bold",
              }}
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
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Montserrat_500Medium",
                color: themeSchema[theme].colorText,
              }}
            >
              {i18n._("commentsWon")}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#F5D65A",
                fontFamily: "Montserrat_700Bold",
              }}
            >
              {nbTopComment}
            </Text>
          </View>
        </View>
      </View>
      <FlatList
        data={trophies}
        style={{
          ...styles.seedContainer,
          backgroundColor: themeSchema[theme].backgroundColor2,
        }}
        renderItem={(param) => renderItem(param, navigation, currentUser)}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.5}
        onEndReached={async () => {
          if (Platform.OS === "web" || noMoreData) return;
          // return ;
          nbTrophies += frequency;
          await fetchMore({
            variables: {
              first: frequency,
              skip: nbTrophies - frequency,
              userId,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const { trophies: moreTrophies } = fetchMoreResult;
              if (isEmpty(moreTrophies)) return setNoMoreData(true);
              setTrophies((previousState) =>
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
        ListFooterComponent={() => {
          if (noMoreData) return null;
          return <ActivityIndicator style={{ marginBottom: 70 }} />;
        }}
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

export default Trophies;
