import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Header from "../Components/Header";
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import CommentBox from "../Components/CommentBox";
import Select from "../Components/Select";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import { gql, useSubscription, useMutation, useQuery } from "@apollo/client";
import UserContext from "../CustomProperties/UserContext";
import { get, last, isEmpty } from "lodash";
import useEffectUpdate from "../Library/useEffectUpdate";
import hasVoted from "../Library/hasVoted";
import {
  SEND_BLUE_VOTE,
  SEND_RED_VOTE,
  SEND_POSITIVE_VOTE,
  SEND_NEGATIVE_VOTE,
} from "../gql/votes";
import { cloneDeepWith, isNil, findIndex } from "lodash";
import voteDispatch from "../Library/voteDispatch";
import idExist from "../Library/idExist";

const displayPercent = ({ votes, totalVotes, answer }) => {
  if (totalVotes === 0) return `0%\n${answer}`;
  return `${Math.round((votes / totalVotes) * 100)}%\n${answer}`;
};

const manageHeightButton = ({ answerOne, answerTwo }) => {
  const oneLine = 38;
  const twoLines = 55;
  const threeLines = 70;

  if (answerOne.length <= 14 && answerTwo.length <= 14) return oneLine;

  if (answerOne.length > 14 && answerOne.length <= 28) {
    if (answerTwo.length <= 28) {
      return twoLines;
    }
    if (answerTwo.length > 28) {
      return threeLines;
    }
  }
  if (answerTwo.length > 14 && answerTwo.length <= 28) {
    if (answerOne.length <= 28) {
      return twoLines;
    }
    if (answerOne.length > 28) {
      return threeLines;
    }
  }
  if (answerOne.length > 28 || answerTwo.length > 28) {
    return threeLines;
  }
};

const COMMENTS_SUB = gql`
  subscription($debateId: String!) {
    comment(debateId: $debateId) {
      node {
        id
        debate {
          id
          closed
        }
        nested
        from {
          id
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

const CREATE_COMMENT = gql`
  mutation($content: String!, $from: String!, $debate: ID!) {
    createComment(
      data: {
        content: $content
        from: { connect: { email: $from } }
        debate: { connect: { id: $debate } }
      }
    ) {
      id
    }
  }
`;

const GET_COMMENTS = gql`
  query($debate: ID!, $last: Int, $skip: Int) {
    comments(
      where: { debate: { id: $debate }, nested: false }
      last: $last
      skip: $skip
      orderBy: updatedAt_DESC
    ) {
      id
      debate {
        id
        closed
      }
      nested
      from {
        id
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
      updatedAt
    }
  }
`;

const CLOSE_DEBATE = gql`
  mutation($debateId: ID!) {
    closeMyDebate(debateId: $debateId) {
      id
    }
  }
`;

const DELETE_DEBATE = gql`
  mutation($debateId: ID!) {
    deleteMyDebate(debateId: $debateId) {
      id
    }
  }
`;

const ASK_DELETE_DEBATE = gql`
  mutation($debateId: ID!, $userId: String!) {
    askDeleteDebate(debateId: $debateId, userId: $userId) {
      id
    }
  }
`;

const ASK_CLOSE_DEBATE = gql`
  mutation($debateId: ID!, $userId: String!) {
    askCloseDebate(debateId: $debateId, userId: $userId) {
      id
    }
  }
`;

const renderItem = (
  { item },
  navigation,
  theme,
  debateId,
  currentUser,
  query
) => {
  if (query === false) return <ActivityIndicator size={36} />;
  if (item.nested === true) return null;
  return (
    <View
      style={{
        paddingLeft: 15,
        paddingRight: 15,
      }}
    >
      <CommentBox
        theme={theme}
        comment={item}
        debateId={debateId}
        navigation={navigation}
        currentUser={currentUser}
      />
    </View>
  );
};

const isOwner = (currentUser, debate) => {
  if (isNil(get(currentUser, "id"))) return false;
  const owner = get(debate, "owner.id");
  if (isNil(owner)) {
    const ownerBlue = get(debate, "ownerBlue.id");
    const ownerRed = get(debate, "ownerRed.id");
    if (isNil(ownerBlue) || isNil(ownerRed)) return false;
    return currentUser.id === ownerRed || currentUser.id === ownerBlue;
  }
  return owner === currentUser.id;
};

const frequency = 10;
let nbComments = frequency;

const Debate = (props) => {
  const { navigation, route } = props;
  const { debate, setDebates, debateIndex, setHomeDebates } = route.params;

  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);

  const [comment, setComment] = React.useState("");
  const [comments, setComments] = React.useState([]);

  const [keyboardIsOpen, setKeyboardIsOpen] = React.useState(false);
  const commentsScrollViewRef = React.useRef(null);
  const [query, setQuery] = React.useState(false);
  const [noMoreData, setNoMoreData] = React.useState(false);
  // const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  const [pour, setPour] = React.useState(
    debate.type === "STANDARD" || debate.type === "MUDDLE"
      ? debate.positives.length
      : debate.blueVotes.length
  );
  const [contre, setContre] = React.useState(
    debate.type === "STANDARD" || debate.type === "MUDDLE"
      ? debate.negatives.length
      : debate.redVotes.length
  );
  const [voted, setVoted] = React.useState(
    hasVoted({
      ...debate,
      currentUser,
    })
  );

  const [sendNegativeVote] = useMutation(SEND_NEGATIVE_VOTE, {
    variables: {
      debate: debate.id,
      userId: currentUser.id,
    },
  });

  const [sendPositiveVote] = useMutation(SEND_POSITIVE_VOTE, {
    variables: {
      debate: debate.id,
      userId: currentUser.id,
    },
  });

  const [sendBlueVote] = useMutation(SEND_BLUE_VOTE, {
    variables: {
      debate: debate.id,
      userId: currentUser.id,
    },
  });

  const [sendRedVote] = useMutation(SEND_RED_VOTE, {
    variables: {
      debate: debate.id,
      userId: currentUser.id,
    },
  });

  const [closeDebate] = useMutation(CLOSE_DEBATE, {
    variables: {
      debateId: debate.id,
    },
    onCompleted: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    },
  });

  const [askCloseDebate] = useMutation(ASK_CLOSE_DEBATE);
  const [askDeleteDebate] = useMutation(ASK_DELETE_DEBATE);

  const [deleteDebate] = useMutation(DELETE_DEBATE, {
    variables: {
      debateId: debate.id,
    },
    onCompleted: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    },
  });

  const { loading, error, fetchMore } = useQuery(GET_COMMENTS, {
    variables: {
      debate: debate.id,
      last: nbComments,
    },
    onCompleted: (response) => {
      const { comments: queryResult } = response;
      setComments(queryResult);
      if (!query) setQuery(true);
      if (queryResult.length === 0) setNoMoreData(true);
    },
    onError: (error) => {
      console.log(error);
    },
    fetchPolicy: "cache-and-network",
    // skip: true,
  });

  const { data: commentPayload } = useSubscription(COMMENTS_SUB, {
    variables: {
      debateId: debate.id,
    },
    shouldResubscribe: true,
    onSubscriptionData: (response) => {
      // console.log(Object.keys(response));
      const { subscriptionData } = response;
      // console.log(subscriptionData.data.comment);
      const payload = get(subscriptionData, "data.comment.node");
      // console.log(payload);
      if (payload !== undefined) {
        if (idExist(comments, payload.id)) {
          const payloadId = payload.id;
          const commentIndex = comments.findIndex((c) => c.id === payloadId);
          // console.log(commentIndex);
          if (commentIndex !== -1)
            setComments((cs) => {
              const cpyCs = cloneDeepWith(cs);
              cpyCs[commentIndex] = payload;
              // console.log(cpyCs[commentIndex].likes);
              return cpyCs;
            });
        } else {
          setComments((cs) => [payload, ...cs]);
        }
      }
    },
  });

  useEffectUpdate(() => {
    if (
      comments.length !== 0 &&
      last(comments).from.email === currentUser.email &&
      query
    ) {
      if (commentsScrollViewRef.current) {
        commentsScrollViewRef.current.scrollToIndex({
          index: 0,
          animated: true,
        });
      }
    }
  }, [comments]);

  const [createComment, { data: mutationResponse }] = useMutation(
    CREATE_COMMENT
  );

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        // setKeyboardHeight(e.endCoordinates.height);
        setKeyboardIsOpen(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardIsOpen(false)
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const votes = pour + contre;
  const commentsLength = debate.comments.length;

  // console.log(voted);
  // console.log(setDebates);
  // console.log(debateIndex);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeSchema[theme].backgroundColor2,
      }}
    >
      <Header hidden />
      <View
        style={{
          height: 50,
          backgroundColor: themeSchema[theme].backgroundColor2,
          width: "100%",
          zIndex: 10,
          shadowOffset: { width: 1, height: 1 },
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 1,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 3 }}
        >
          <CustomIcon
            name={"chevron-left"}
            size={38}
            color={themeSchema[theme].colorText}
          />
        </TouchableOpacity>
        <View
          style={{
            marginLeft: "auto",
            marginTop: 10,
            marginRight: 10,
          }}
        >
          <Select
            list={[
              !isOwner(currentUser, debate)
                ? {
                    label: i18n._("reportDebate"),
                    value: "REPORT",
                  }
                : null,
              isOwner(currentUser, debate) && !debate.closed
                ? debate.type === "DUO"
                  ? {
                      label: i18n._("askCloseDebate"),
                      value: "CLOSE_DUO",
                    }
                  : {
                      label: i18n._("closeDebate"),
                      value: "CLOSE",
                    }
                : null,
              isOwner(currentUser, debate)
                ? debate.type === "DUO"
                  ? {
                      label: i18n._("askDeleteDebate"),
                      value: "DELETE_DUO",
                    }
                  : {
                      label: i18n._("deleteDebate"),
                      value: "DELETE",
                    }
                : null,
            ]}
            selected={null}
            placeholder=""
            onSelect={(action) => {
              if (action.value === "REPORT")
                navigation.push("Report", {
                  type: "DEBATE",
                  content: debate,
                });

              if (action.value === "CLOSE") {
                closeDebate();
              }
              if (action.value === "CLOSE_DUO") {
                askCloseDebate({
                  variables: {
                    debateId: debate.id,
                    userId:
                      debate.ownerRed.id === currentUser.id
                        ? debate.ownerBlue.id
                        : debate.ownerRed.id,
                  },
                });
              }
              if (action.value === "DELETE") {
                deleteDebate();
              }
              if (action.value === "DELETE_DUO") {
                askDeleteDebate({
                  variables: {
                    debateId: debate.id,
                    userId:
                      debate.ownerRed.id === currentUser.id
                        ? debate.ownerBlue.id
                        : debate.ownerRed.id,
                  },
                });
              }
            }}
            renderComponent={
              <CustomIcon
                name="more-vert"
                size={28}
                color={themeSchema[theme].colorText}
              />
            }
          />
        </View>
      </View>

      {/* )} */}
      <FlatList
        data={comments}
        ref={commentsScrollViewRef}
        style={{
          ...styles.seedContainer,
          backgroundColor: themeSchema[theme].backgroundColor1,
        }}
        renderItem={(param) =>
          renderItem(param, navigation, theme, debate.id, currentUser, query)
        }
        keyExtractor={(item) => item.id}
        // inverted={true}
        onEndReachedThreshold={0.5}
        onEndReached={async () => {
          if (Platform.OS === "web" || noMoreData) return;
          // return ;
          nbComments += frequency;
          await fetchMore({
            variables: {
              last: frequency,
              skip: nbComments - frequency,
              debate: debate.id,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const { comments: moreComments } = fetchMoreResult;
              if (isEmpty(moreComments)) return setNoMoreData(true);
              setComments((previousState) =>
                [...previousState, ...moreComments].reduce((acc, current) => {
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
        ListHeaderComponent={() => {
          if (debate.type === "STANDARD" || debate.type === "MUDDLE")
            return (
              <View
                style={{
                  ...styles.boxDebate,
                  backgroundColor: themeSchema[theme].backgroundColor2,
                }}
              >
                <View style={styles.headDebate}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push("Profile", {
                        userId: debate.owner.email,
                      });
                    }}
                  >
                    <Image
                      source={{ uri: debate.owner.profilePicture }}
                      style={styles.userPicture}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push("Profile", {
                        userId: debate.owner.email,
                      });
                    }}
                  >
                    <Text
                      style={{
                        ...styles.pseudo,
                        color: themeSchema[theme].colorText,
                      }}
                    >
                      {debate.type === "MUDDLE"
                        ? debate.owner.firstname
                        : `${debate.owner.firstname} ${debate.owner.lastname}`}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* <ScrollView
                  style={{
                    // maxHeight: Dimensions.get("screen").height / 6,
                  }}
                > */}
                <Text
                  style={{
                    ...styles.debateText,
                    color: themeSchema[theme].colorText,
                  }}
                >
                  {debate.content}
                </Text>
                {debate.image && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push("IsolateImage", {
                        image: debate.image,
                      });
                    }}
                  >
                    <Image
                      source={{
                        uri: debate.image,
                      }}
                      style={{
                        width: Dimensions.get("screen").width / 1.15,
                        height: 280,
                        borderRadius: 5,
                        marginTop: 5,
                        marginBottom: 5,
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
                {/* 
                // Use that to integrate image + add touchable oppacity for isolate image view
                <Image
                  source={{
                    uri:
                      "https://images.lanouvellerepublique.fr/image/upload/5b95be27be7744fb5c8b467b.jpg",
                  }}
                  style={{
                    width: Dimensions.get("screen").width / 1.2,
                    height: 150,
                    marginRight: "auto",
                  }}
                  resizeMode="contain"
                /> */}
                {/* </ScrollView> */}
                <View
                  style={{
                    height: 1,
                    backgroundColor: themeSchema[theme].hrLineColor,
                    width: "100%",
                    alignSelf: "center",
                  }}
                />
                <View style={styles.debateFooter}>
                  <Text
                    style={{
                      ...styles.footerText,
                      color: themeSchema[theme].colorText,
                    }}
                  >{`${votes} vote${votes > 1 ? "s" : ""}`}</Text>
                  <Text
                    style={{
                      ...styles.footerText,
                      color: themeSchema[theme].colorText,
                    }}
                  >{`${commentsLength} ${i18n._("comment")}${
                    commentsLength > 1 ? "s" : ""
                  }`}</Text>
                </View>
                <View style={styles.debateActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setPour((v) => v + 1);
                      setVoted("pour");
                      sendPositiveVote();
                      voteDispatch({
                        setDebates,
                        setHomeDebates,
                        debateIndex,
                        voteType: "positives",
                        currentUser,
                        debate,
                      });
                    }}
                    style={
                      voted
                        ? {
                            ...styles.votePourButton,
                            backgroundColor:
                              voted === "pour"
                                ? "#F47658"
                                : themeSchema[theme].backgroundColor2,
                            height: manageHeightButton(debate),
                          }
                        : {
                            ...styles.votePourButton,
                            backgroundColor:
                              themeSchema[theme].backgroundColor2,
                            height: manageHeightButton(debate),
                          }
                    }
                    disabled={voted || debate.closed}
                  >
                    <Text
                      // numberOfLines={1}
                      style={{
                        color: themeSchema[theme].colorText,
                        fontSize: 12,
                        paddingLeft: 12,
                        paddingRight: 12,
                        textAlign: "center",
                        fontFamily: voted
                          ? "Montserrat_600SemiBold"
                          : "Montserrat_500Medium",
                      }}
                    >
                      {voted || debate.closed
                        ? displayPercent({
                            votes: pour,
                            totalVotes: votes,
                            answer: debate.answerOne,
                          })
                        : debate.answerOne}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={
                      voted
                        ? {
                            ...styles.voteContreButton,
                            backgroundColor:
                              voted === "contre"
                                ? themeSchema[theme].colorText
                                : themeSchema[theme].colorText3,
                            borderColor: themeSchema[theme].colorText,
                            height: manageHeightButton(debate),
                          }
                        : {
                            ...styles.voteContreButton,
                            backgroundColor:
                              themeSchema[theme].backgroundColor2,
                            borderColor: themeSchema[theme].colorText,
                            height: manageHeightButton(debate),
                          }
                    }
                    onPress={() => {
                      setContre((v) => v + 1);
                      setVoted("contre");
                      sendNegativeVote();
                      voteDispatch({
                        setDebates,
                        setHomeDebates,
                        debateIndex,
                        voteType: "negatives",
                        currentUser,
                        debate,
                      });
                    }}
                    disabled={voted || debate.closed}
                  >
                    <Text
                      // numberOfLines={1}
                      style={
                        voted
                          ? {
                              color:
                                voted === "contre"
                                  ? themeSchema[theme].colorText3
                                  : themeSchema[theme].colorText,
                              fontSize: 12,
                              paddingLeft: 6,
                              paddingRight: 6,
                              fontFamily: "Montserrat_600SemiBold",
                              textAlign: "center",
                            }
                          : {
                              color: themeSchema[theme].colorText,
                              fontSize: 12,
                              paddingLeft: 6,
                              paddingRight: 6,
                              fontFamily: "Montserrat_500Medium",
                              textAlign: "center",
                            }
                      }
                    >
                      {voted || debate.closed
                        ? displayPercent({
                            votes: contre,
                            totalVotes: votes,
                            answer: debate.answerTwo,
                          })
                        : debate.answerTwo}
                    </Text>
                  </TouchableOpacity>
                  {Platform.OS === "ios" && (
                    <TouchableOpacity
                      onPress={() => {}}
                      style={{
                        ...styles.commentButton,
                        backgroundColor: themeSchema[theme].backgroundColor2,
                        borderColor: themeSchema[theme].colorText,
                        alignSelf: "center",
                      }}
                    >
                      <CustomIcon
                        name="more-horiz"
                        size={28}
                        color={themeSchema[theme].colorText}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          if (debate.type === "DUO")
            return (
              <View
                style={{
                  ...styles.boxDebate,
                  backgroundColor: themeSchema[theme].backgroundColor2,
                }}
              >
                <View style={styles.headDebateDuo}>
                  <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.push("Profile", {
                          userId: debate.ownerBlue.email,
                        });
                      }}
                    >
                      <Image
                        source={{ uri: debate.ownerBlue.profilePicture }}
                        style={styles.userPictureBlue}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.push("Profile", {
                          userId: debate.ownerBlue.email,
                        });
                      }}
                    >
                      <Text
                        style={{
                          ...styles.pseudoDuo,
                          color: themeSchema[theme].colorText,
                        }}
                      >
                        {`${debate.ownerBlue.firstname} ${debate.ownerBlue.lastname}`}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.push("Profile", {
                          userId: debate.ownerRed.email,
                        });
                      }}
                    >
                      <Image
                        source={{ uri: debate.ownerRed.profilePicture }}
                        style={styles.userPictureRed}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.push("Profile", {
                          userId: debate.ownerRed.email,
                        });
                      }}
                    >
                      <Text
                        style={{
                          ...styles.pseudoDuo,
                          color: themeSchema[theme].colorText,
                        }}
                      >
                        {`${debate.ownerRed.firstname} ${debate.ownerRed.lastname}`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text
                  // numberOfLines={8}
                  style={{
                    ...styles.debateTextDuo,
                    color: themeSchema[theme].colorText,
                  }}
                >
                  {debate.content}
                </Text>
                {debate.image && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push("IsolateImage", {
                        image: debate.image,
                      });
                    }}
                  >
                    <Image
                      source={{
                        uri: debate.image,
                      }}
                      style={{
                        width: Dimensions.get("screen").width / 1.15,
                        height: 280,
                        borderRadius: 5,
                        marginTop: 5,
                        marginBottom: 5,
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}

                <View style={styles.debateActionsDuo}>
                  <TouchableOpacity
                    onPress={() => {
                      setPour((v) => v + 1);
                      setVoted("pour");
                      sendBlueVote();
                      voteDispatch({
                        setDebates,
                        setHomeDebates,
                        debateIndex,
                        voteType: "blueVotes",
                        currentUser,
                        debate,
                      });
                    }}
                    style={
                      voted
                        ? {
                            ...styles.votePourButton,
                            backgroundColor:
                              voted === "pour"
                                ? "#F47658"
                                : themeSchema[theme].backgroundColor2,
                            height: manageHeightButton(debate),
                          }
                        : {
                            ...styles.votePourButton,
                            backgroundColor:
                              themeSchema[theme].backgroundColor2,
                            height: manageHeightButton(debate),
                          }
                    }
                    disabled={voted || debate.closed}
                  >
                    <Text
                      // numberOfLines={1}
                      style={{
                        color: themeSchema[theme].colorText,
                        fontSize: 12,
                        paddingLeft: 12,
                        paddingRight: 12,
                        textAlign: "center",
                        fontFamily:
                          voted === "pour"
                            ? "Montserrat_600SemiBold"
                            : "Montserrat_500Medium",
                      }}
                    >
                      {voted || debate.closed
                        ? displayPercent({
                            votes: pour,
                            totalVotes: votes,
                            answer: debate.answerOne,
                          })
                        : debate.answerOne}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push("Debate", {
                        debate,
                      });
                    }}
                    style={{
                      ...styles.commentDuoButton,
                      backgroundColor: themeSchema[theme].backgroundColor2,
                      borderColor: themeSchema[theme].colorText,
                      alignSelf: "center",
                    }}
                  >
                    <CustomIcon
                      name="more-horiz"
                      size={28}
                      color={themeSchema[theme].colorText}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setContre((v) => v + 1);
                      setVoted("contre");
                      sendRedVote();
                      voteDispatch({
                        setDebates,
                        setHomeDebates,
                        debateIndex,
                        voteType: "redVotes",
                        currentUser,
                        debate,
                      });
                    }}
                    style={
                      voted === "contre"
                        ? {
                            ...styles.voteRedButton,
                            backgroundColor: contre
                              ? themeSchema[theme].colorText
                              : themeSchema[theme].colorText3,
                            borderColor: themeSchema[theme].colorText,
                            height: manageHeightButton(debate),
                          }
                        : {
                            ...styles.voteRedButton,
                            backgroundColor:
                              themeSchema[theme].backgroundColor2,
                            borderColor: themeSchema[theme].colorText,
                            height: manageHeightButton(debate),
                          }
                    }
                    disabled={voted || debate.closed}
                  >
                    <Text
                      // numberOfLines={1}
                      style={
                        voted === "contre"
                          ? {
                              color: contre
                                ? themeSchema[theme].colorText3
                                : themeSchema[theme].colorText,
                              fontSize: 12,
                              paddingLeft: 6,
                              paddingRight: 6,
                              fontFamily: "Montserrat_600SemiBold",
                              textAlign: "center",
                            }
                          : {
                              color: themeSchema[theme].colorText,
                              fontSize: 12,
                              paddingLeft: 6,
                              paddingRight: 6,
                              fontFamily: "Montserrat_500Medium",
                              textAlign: "center",
                            }
                      }
                    >
                      {voted || debate.closed
                        ? displayPercent({
                            votes: contre,
                            totalVotes: votes,
                            answer: debate.answerTwo,
                          })
                        : debate.answerTwo}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: themeSchema[theme].hrLineColor,
                    width: "100%",
                    alignSelf: "center",
                    marginTop: 15,
                  }}
                />
                <View style={styles.debateFooter}>
                  <Text
                    style={{
                      ...styles.footerText,
                      color: themeSchema[theme].colorText,
                    }}
                  >{`${votes} vote${votes > 1 ? "s" : ""}`}</Text>
                  <Text
                    style={{
                      ...styles.footerText,
                      color: themeSchema[theme].colorText,
                    }}
                  >{`${commentsLength} ${i18n._("comment")}${
                    commentsLength > 1 ? "s" : ""
                  }`}</Text>
                </View>
              </View>
            );
        }}
        ListFooterComponent={() => {
          if (noMoreData) return <View style={{ height: 50, width: 10 }} />;
          // return null;
          return <ActivityIndicator style={{ marginBottom: 70 }} />;
        }}
      />

      {/* <ScrollView
        ref={commentsScrollViewRef}

        style={{
          ...styles.seedContainer,
          backgroundColor: themeSchema[theme].backgroundColor1,
        }}
      >
        {query === false ? (
          <ActivityIndicator size={36} />
        ) : (
          comments
            .filter((comm) => comm.nested === false)
            .map((comm) => (
              <CommentBox
                theme={theme}
                comment={comm}
                debateId={debate.id}
                navigation={navigation}
                key={comm.id}
                currentUser={currentUser}
              />
            ))
        )}
      </ScrollView> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : ""}
        style={
          // Platform.OS === "android" &&
          keyboardIsOpen && {
            bottom: 0,
            elevation: 10,
            position: "absolute",
          }
        }
      >
        <View //HAVE TO FIX ISSUE FOR KEYBOARD HERE
          style={{
            minHeight: 60,
            maxHeight: 200,
            width: "100%",
            backgroundColor: themeSchema[theme].backgroundColor2,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 10,
            flexDirection: "row",
          }}
        >
          <TextInput
            editable={!debate.closed}
            multiline
            placeholder={i18n._("yourComment")}
            value={comment}
            style={{
              width:
                Dimensions.get("screen").width - 55 - (keyboardIsOpen ? 45 : 0),
              minHeight: 40,
              maxHeight: 60,
              borderRadius: 10,
              backgroundColor: themeSchema[theme].backgroundColor1,
              color: themeSchema[theme].colorText,
              marginLeft: "auto",
              // marginRight: "auto",
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 20,
              paddingRight: 20,
              // alignItems: "center",
              // marginBottom: 14,
              marginTop: 10,
              fontFamily: "Montserrat_500Medium",
              // marginBottom: 20,
            }}
            keyboardType="default"
            onChangeText={(c) => setComment(c)}
            placeholderTextColor={themeSchema[theme].colorText}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: 45 + (keyboardIsOpen ? 45 : 0),
              marginTop: 10,
            }}
          >
            {keyboardIsOpen && (
              <TouchableOpacity onPress={() => Keyboard.dismiss()}>
                <CustomIcon
                  name="keyboard-hide"
                  size={26}
                  color={themeSchema[theme].colorText}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                createComment({
                  variables: {
                    from: currentUser.email,
                    content: comment,
                    debate: debate.id,
                  },
                });
                setComment("");
              }}
              disabled={comment.length <= 0 || debate.closed}
            >
              <CustomIcon
                name="send"
                size={26}
                color={themeSchema[theme].colorText}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  seedContainer: {
    // flex: 1,
    backgroundColor: "#F7F7F7",
    // paddingLeft: 15,
    // paddingRight: 15,
    // paddingTop: 10,
  },
  boxDebate: {
    // maxHeight: 248,
    backgroundColor: "white",
    elevation: 10,
    // borderRadius: 7,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    padding: 20,
    shadowOffset: { width: 3, height: 3 },
    // shadowColor: "red",
    shadowOpacity: 0,
    shadowRadius: 0,
    margin: 0,
    marginBottom: 0,
  },
  headDebate: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  debateText: {
    fontSize: 12,
    paddingBottom: 10,
    fontFamily: "Montserrat_500Medium",
  },
  debateFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
  },
  footerText: {
    fontSize: 10,
    fontFamily: "Montserrat_500Medium",
  },
  debateActions: {
    flexDirection: "row",
    marginTop: 10,
  },
  userPicture: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  pseudo: {
    marginLeft: 9,
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    // paddingTop: 6,
  },
  votePourButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingTop: 2,
    // paddingLeft: 30,
    // paddingRight: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#F47658",
    borderStyle: "solid",
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    width: 128,
    // marginLeft: 5,
  },
  voteContreButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingTop: 2,
    // paddingLeft: 30,
    // paddingRight: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    borderStyle: "solid",
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    width: 128,
    marginLeft: 5,
  },
  commentButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingTop: 2,
    // paddingLeft: 30,
    // paddingRight: 30,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderWidth: 2,
    borderColor: "#000",
    borderStyle: "solid",
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    marginLeft: "auto",
  },

  // DUO

  userPictureBlue: {
    width: 52,
    height: 52,
    borderRadius: 30,
    // borderWidth: 6,
    // borderColor: "#6194EC80",
  },
  userPictureRed: {
    width: 52,
    height: 52,
    borderRadius: 30,
    // borderWidth: 6,
    // borderColor: "#F6577780",
  },
  pseudoDuo: {
    // marginLeft: 9,
    fontWeight: "500",
    fontSize: 12,
    // paddingTop: 6,
    marginTop: 3,
    fontFamily: "Montserrat_500Medium",
  },
  headDebateDuo: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },
  debateTextDuo: {
    fontSize: 12,
    paddingBottom: 10,
    textAlign: "center",
    marginTop: 10,
    fontFamily: "Montserrat_500Medium",
    // marginLeft: "auto",
    // marginRight: "auto",
    // alignSelf: "center",
  },
  debateActionsDuo: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  voteBlueButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingTop: 2,
    // paddingLeft: 30,
    // paddingRight: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#F47658",
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    // marginLeft: 5,
  },
  voteRedButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingTop: 2,
    // paddingLeft: 30,
    // paddingRight: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#F65777",
    borderStyle: "solid",
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    // marginLeft: 5,
  },
  commentDuoButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingTop: 2,
    // paddingLeft: 30,
    // paddingRight: 30,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderWidth: 2,
    borderColor: "#000",
    borderStyle: "solid",
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    // marginLeft: "auto",
  },
});

export default Debate;
