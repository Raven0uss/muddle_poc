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
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";
import { useQuery, gql } from "@apollo/client";
import DebateBox from "../Components/DebateBox";
import { isEmpty } from "lodash";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import UserContext from "../CustomProperties/UserContext";
import themeSchema from "../CustomProperties/Theme";
import GET_DEBATES from "../gql/getDebates";

const frequency = 6;
let nbDebates = frequency;

const renderItem = (
  { item, index },
  navigation,
  theme,
  currentUser,
  setDebates,
  setHomeDebates
) => {
  // console.log(setHomeDebates);
  return (
    <DebateBox
      currentUser={currentUser}
      theme={theme}
      debate={item}
      navigation={navigation}
      index={index}
      setDebates={setDebates}
      setHomeDebates={setHomeDebates}
    />
  );
};

// const applyFilter = ({ debates, debateType }) => {
//   if (debateType === "DUO")
//     return debates.filter((debate) => debate.type === "DUO");
//   if (debateType === "MUDDLE")
//     return debates.filter((debate) => debate.type === "MUDDLE");
//   if (debateType === "BEST_DEBATES")
//     return debates.filter((debate) => debate.type === "STANDARD");
//   if (debateType === "MY_DEBATES")
//     return debates.filter((debate) => {
//       return debate.type === "STANDARD";
//     });
//   return debates;
// };

const DebatesFiltered = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);
  const [debates, setDebates] = React.useState([]);
  const [noMoreData, setNoMoreData] = React.useState(false);
  const [debateType, setDebateType] = React.useState("DUO");

  const { data, loading, error, fetchMore } = useQuery(
    GET_DEBATES(debateType),
    {
      variables: {
        first: nbDebates,
        ...(debateType === "BEST_DEBATES" || debateType === "MY_DEBATES"
          ? {}
          : { filter: debateType }),
        user: currentUser.email,
      },
      onCompleted: (response) => {
        const queryResult = response[Object.keys(response)[0]];
        // const { debates: queryResult } = response;
        // console.log(response);
        setDebates(queryResult);
        if (queryResult.length === 0) setNoMoreData(true);
      },
      onError: (error) => {
        nbDebates = frequency;
        setNoMoreData(true);
        // console.log(error);
      },
      // notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
    }
  );

  const { navigation, route } = props;

  const { setHomeDebates } = route.params;

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
          backgroundColor: themeSchema[theme].backgroundColor1,
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
              debateType === "MY_DEBATES"
                ? styles.buttonActivate
                : {
                    ...styles.buttonDefaultState,
                    backgroundColor: themeSchema[theme].backgroundColor2,
                    borderColor: themeSchema[theme].colorText,
                  }
            }
            onPress={() => {
              nbDebates = frequency;
              setDebates([]);
              setDebateType("MY_DEBATES");
              setNoMoreData(false);
            }}
          >
            <Text
              style={{
                ...styles.buttonTextDefaultState,
                color: themeSchema[theme].colorText,
              }}
            >
              {i18n._("myDebates")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              debateType === "BEST_DEBATES"
                ? styles.buttonActivate
                : {
                    ...styles.buttonDefaultState,
                    backgroundColor: themeSchema[theme].backgroundColor2,
                    borderColor: themeSchema[theme].colorText,
                  }
            }
            onPress={() => {
              nbDebates = frequency;
              setDebates([]);
              setDebateType("BEST_DEBATES");
              setNoMoreData(false);
            }}
          >
            <Text
              style={{
                ...styles.buttonTextDefaultState,
                color: themeSchema[theme].colorText,
              }}
            >
              {i18n._("bestDebates")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              debateType === "DUO"
                ? styles.buttonActivate
                : {
                    ...styles.buttonDefaultState,
                    backgroundColor: themeSchema[theme].backgroundColor2,
                    borderColor: themeSchema[theme].colorText,
                  }
            }
            onPress={() => {
              nbDebates = frequency;
              setDebates([]);
              setDebateType("DUO");
              setNoMoreData(false);
            }}
          >
            <Text
              style={{
                ...styles.buttonTextDefaultState,
                color: themeSchema[theme].colorText,
              }}
            >
              {i18n._("duoDebates")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              debateType === "MUDDLE"
                ? styles.buttonActivate
                : {
                    ...styles.buttonDefaultState,
                    backgroundColor: themeSchema[theme].backgroundColor2,
                    borderColor: themeSchema[theme].colorText,
                  }
            }
            onPress={() => {
              nbDebates = frequency;
              setDebates([]);
              setDebateType("MUDDLE");
              setNoMoreData(false);
            }}
          >
            <Text
              style={{
                ...styles.buttonTextDefaultState,
                color: themeSchema[theme].colorText,
              }}
            >
              {i18n._("generatedDebates")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      {loading && debates.length === 0 ? (
        <SafeAreaView
          style={{
            ...styles.loadingContainer,
            backgroundColor: themeSchema[theme].backgroundColor1,
          }}
        >
          <ActivityIndicator />
        </SafeAreaView>
      ) : (
        <FlatList
          data={debates}
          // data={applyFilter({ debates, debateType })}
          style={{
            ...styles.seedContainer,
            backgroundColor: themeSchema[theme].backgroundColor1,
          }}
          renderItem={(param) =>
            renderItem(
              param,
              navigation,
              theme,
              currentUser,
              setDebates,
              setHomeDebates
            )
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
                // console.log(fetchMoreResult);
                try {
                  // const { debates: moreDebates } = fetchMoreResult;
                  const moreDebates =
                    fetchMoreResult[Object.keys(fetchMoreResult)[0]];

                  if (isEmpty(moreDebates)) setNoMoreData(true);
                  setDebates((previousState) =>
                    [...previousState, ...moreDebates].reduce(
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
                } catch (err) {
                  console.log(err);
                }
              },
            });
          }}
          ListFooterComponent={() => {
            if (noMoreData) return <View style={{ height: 50, width: 10 }} />;
            return <ActivityIndicator style={{ marginBottom: 70 }} />;
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F47658",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F7F7F7",
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
    fontFamily: "Montserrat_700Bold",
  },
});

export default DebatesFiltered;
