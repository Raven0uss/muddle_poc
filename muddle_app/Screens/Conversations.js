import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Text,
  SafeAreaView,
} from "react-native";
import Header from "../Components/Header";
import CustomIcon from "../Components/Icon";
import { muddle } from "../CustomProperties/IconsBase64";
import { useQuery, gql } from "@apollo/client";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import { isEmpty, isNil } from "lodash";
import ThemeContext from "../CustomProperties/ThemeContext";
import UserContext from "../CustomProperties/UserContext";
import themeSchema from "../CustomProperties/Theme";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import CertifiedIcon from "../Components/CertifiedIcon";

// messages_some: { content_not: null }

const GET_CONVERSATIONS = gql`
  query($first: Int!, $skip: Int, $user: String!) {
    conversations(
      first: $first
      skip: $skip
      where: { speakers_some: { email: $user } }
      orderBy: updatedAt_DESC
    ) {
      updatedAt
      id
      speakers {
        id
        firstname
        certified
        lastname
        email
        profilePicture
      }
      messages(last: 1) {
        id
        content
        createdAt
        read
        from {
          id
        }
      }
    }
  }
`;

const frequency = 20;
let nbConversations = frequency;

const renderItem = ({ item }, navigation, theme, currentUser) => {
  const lastMessage = item.messages[item.messages.length - 1];
  if (isNil(lastMessage)) return null;
  const speaker = item.speakers.filter((u) => u.email !== currentUser.email);
  if (speaker.length === 0) return null;
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push("Chat", {
          conversation: item,
        });
      }}
    >
      <View
        style={{
          width: Dimensions.get("screen").width / 1.2,
          height: 72,
          borderRadius: 10,
          backgroundColor: themeSchema[theme].backgroundColor1,
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 20,
          marginBottom: 5,
          paddingRight: 5,
        }}
      >
        <Image
          source={{ uri: speaker[0].profilePicture }}
          style={styles.userPicture}
        />
        <View style={{ marginLeft: 40, marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_600SemiBold",
                color: themeSchema[theme].colorText,
              }}
            >
              {`${speaker[0].firstname} ${speaker[0].lastname}`}
              {speaker[0].certified && <CertifiedIcon />}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: "#A3A3A3",
                marginLeft: 5,
                fontFamily: "Montserrat_300Light_Italic",
              }}
            >
              {moment(lastMessage.createdAt).format("HH[h]mm")}
            </Text>
            {!lastMessage.read && lastMessage.from.id !== currentUser.id && (
              <View
                style={{
                  backgroundColor: "#F47658",
                  borderRadius: 50,
                  width: 10,
                  height: 10,
                  marginLeft: "auto",
                  marginTop: -5,
                  marginRight: 5,
                }}
              />
            )}
          </View>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              marginTop: 17,
              fontFamily: "Montserrat_500Medium",
              color: themeSchema[theme].colorText,
            }}
          >
            {lastMessage.content}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Conversations = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);
  const [conversations, setConversations] = React.useState([]);
  const [noMoreData, setNoMoreData] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_CONVERSATIONS,
    {
      variables: {
        first: nbConversations,
        user: currentUser.email,
      },
      onCompleted: (response) => {
        const { conversations: queryResult } = response;
        setConversations(queryResult);
        if (queryResult.length === 0) setNoMoreData(true);
      },
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    }
  );

  const { navigation, route } = props;

  const isFocused = useIsFocused();
  React.useEffect(() => {
    refetch();
  }, [isFocused]);

  // console.log(conversations);
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
              marginBottom: 10,
              //   marginLeft: -10,
            }}
          />
        }
        RightComponent={
          <TouchableOpacity
            style={{ marginTop: 5 }}
            onPress={() =>
              navigation.push("NewConversation", {
                userId: currentUser.email,
              })
            }
          >
            <CustomIcon name="add" size={32} />
          </TouchableOpacity>
        }
      />
      <View
        style={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: themeSchema[theme].backgroundColor2,
          height: 30,
        }}
      >
        {/* <TextInput
          placeholder="Rechercher une conversation"
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
            fontFamily: "Montserrat_500Medium",
          }}
          keyboardType="default"
          onChangeText={(s) => setSearch(s)}
        /> */}
      </View>
      {conversations.length === 0 && loading ? (
        <SafeAreaView
          style={{
            ...styles.loadingContainer,
            backgroundColor: themeSchema[theme].backgroundColor2,
            flex: 1,
          }}
        >
          <ActivityIndicator />
        </SafeAreaView>
      ) : (
        <FlatList
          data={conversations}
          style={{
            backgroundColor: themeSchema[theme].backgroundColor2,
            paddingLeft: 15,
            paddingRight: 15,
          }}
          renderItem={(param) =>
            renderItem(param, navigation, theme, currentUser)
          }
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0.5}
          onEndReached={async () => {
            if (Platform.OS === "web" || noMoreData) return;
            // return ;
            nbConversations += frequency;
            await fetchMore({
              variables: {
                first: frequency,
                skip: nbConversations - frequency,
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                const { conversations: moreConversations } = fetchMoreResult;
                if (isEmpty(moreConversations)) return setNoMoreData(true);
                setConversations((previousState) =>
                  [...previousState, ...moreConversations].reduce(
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
              },
            });
          }}
          ListFooterComponent={() => {
            if (noMoreData) return null;
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
  userPicture: {
    width: 40,
    height: 40,
    borderRadius: 30,
    position: "absolute",
    zIndex: 10,
    // marginTop: -10,
    marginLeft: -15,
    // borderColor: "black",
    // borderWidth: 1,
  },
});

export default Conversations;
