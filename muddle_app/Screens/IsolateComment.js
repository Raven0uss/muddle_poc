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
import { useQuery, gql, useMutation } from "@apollo/client";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import UserContext from "../CustomProperties/UserContext";
import { LIKE_COMMENT, DISLIKE_COMMENT } from "../gql/likeDislike";
import hasLiked from "../Library/hasLiked";
import { useIsFocused } from "@react-navigation/native";
import { get, last, isEmpty } from "lodash";
import CertifiedIcon from "../Components/CertifiedIcon";

const GET_SUBCOMMENTS = gql`
  query($commentId: ID!, $last: Int, $skip: Int) {
    comment(where: { id: $commentId }) {
      id
      likes {
        id
      }
      dislikes {
        id
      }
      debate {
        id
        closed
      }
      comments(last: $last, skip: $skip, orderBy: updatedAt_DESC) {
        id
        debate {
          id
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
        createdAt
        updatedAt
      }
    }
  }
`;

const CREATE_SUBCOMMENT = gql`
  mutation($content: String!, $from: String!, $debate: ID!, $comment: ID!) {
    updateComment(
      where: { id: $comment }
      data: {
        comments: {
          create: {
            content: $content
            from: { connect: { email: $from } }
            debate: { connect: { id: $debate } }
            nested: true
          }
        }
      }
    ) {
      id
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation($commentId: ID!) {
    deleteMyComment(commentId: $commentId) {
      id
    }
  }
`;

const renderItem = ({ item }, navigation, theme, currentUser) => {
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
        navigation={navigation}
        currentUser={currentUser}
      />
    </View>
  );
};

// const Comments = (props) => {
//   const { comments, loading, comment, navigation, theme, currentUser } = props;

//   // if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
//   return (
//     <>
//       {comments.map((c) => (
//         <CommentBox
//           theme={theme}
//           comment={c}
//           navigation={navigation}
//           key={c.id}
//           currentUser={currentUser}
//         />
//       ))}
//     </>
//   );
// };

const frequency = 10;
let nbComments = frequency;

const IsolateComment = (props) => {
  const { navigation, route } = props;
  const { comment } = route.params;

  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);
  const [liked, setLiked] = React.useState(
    hasLiked({ ...comment, currentUser })
  );
  const [comments, setComments] = React.useState([]);
  const [newComment, setNewComment] = React.useState("");
  // const [notify, setNotify] = React.useState(false);
  const [keyboardIsOpen, setKeyboardIsOpen] = React.useState(false);
  // const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  const [noMoreData, setNoMoreData] = React.useState(false);

  // console.log(notify);
  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_SUBCOMMENTS,
    {
      variables: {
        commentId: comment.id,
        last: nbComments,
      },
      onCompleted: (response) => {
        const { comment: queryResult } = response;
        // console.log(last(comments).likes);
        if (queryResult.comments.length === 0) setNoMoreData(true);

        setComments(queryResult.comments);
        hasLiked({ ...queryResult, currentUser });
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      // skip: notify,
    }
  );

  const [createSubComment] = useMutation(CREATE_SUBCOMMENT, {
    onCompleted: async () => {
      // console.log("lol");
      // await refetch();
    },
  });

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

  const [likeComment] = useMutation(LIKE_COMMENT(liked), {
    variables: {
      userId: currentUser.id,
      comment: comment.id,
    },
    onCompleted: async () => {
      // console.log("lol");
      // await refetch();
    },
  });
  const [dislikeComment] = useMutation(DISLIKE_COMMENT(liked), {
    variables: {
      userId: currentUser.id,
      comment: comment.id,
    },
    onCompleted: async () => {
      // console.log("lol");
      // await refetch();
    },
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    variables: {
      commentId: comment.id,
    },

    onCompleted: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    },
  });

  // const isFocused = useIsFocused();
  // React.useEffect(() => {
  //   refetch();
  // }, [isFocused]);

  //   const { comments } = comment;

  return (
    <View
      style={{ flex: 1, backgroundColor: themeSchema[theme].backgroundColor2 }}
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
              comment.from.id !== currentUser.id
                ? {
                    label: i18n._("reportComment"),
                    value: "REPORT",
                  }
                : null,
              comment.from.id === currentUser.id
                ? {
                    label: i18n._("deleteComment"),
                    value: "DELETE",
                  }
                : null,
            ]}
            selected={null}
            placeholder=""
            onSelect={(action) => {
              if (action.value === "REPORT")
                navigation.push("Report", {
                  type: "COMMENT",
                  content: comment,
                });
              if (action.value === "DELETE") {
                deleteComment();
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

      <FlatList
        data={comments}
        // ref={commentsScrollViewRef}
        style={{
          ...styles.seedContainer,
          backgroundColor: themeSchema[theme].backgroundColor1,
        }}
        renderItem={(param) =>
          renderItem(param, navigation, theme, currentUser)
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
              commentId: comment.id,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const { comment: moreComments } = fetchMoreResult;
              if (isEmpty(moreComments.comments)) return setNoMoreData(true);
              console.log(moreComments.comments);
              setComments((previousState) =>
                [...previousState.comments, ...moreComments.comments].reduce(
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
        ListHeaderComponent={() => {
          return (
            <View
              style={{
                backgroundColor: themeSchema[theme].backgroundColor2,
                padding: 20,
              }}
            >
              <View style={styles.headDebate}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.push("Profile", {
                      userId: comment.from.email,
                    });
                  }}
                >
                  <Image
                    source={{ uri: comment.from.profilePicture }}
                    style={styles.userPicture}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.push("Profile", {
                      userId: comment.from.email,
                    });
                  }}
                >
                  <Text
                    style={{
                      ...styles.pseudo,
                      color: themeSchema[theme].colorText,
                    }}
                  >
                    {`${comment.from.firstname} ${comment.from.lastname}`}
                    {comment.from.certified && <CertifiedIcon />}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* <ScrollView
                style={{
                  maxHeight: Dimensions.get("screen").height / 6,
                }}
              > */}
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Montserrat_500Medium",
                  color: themeSchema[theme].colorText,
                }}
              >
                {comment.content}
              </Text>
              {/* </ScrollView> */}
              <View
                style={{
                  height: 1,
                  backgroundColor: themeSchema[theme].hrLineColor,
                  width: "100%",
                  alignSelf: "center",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 3,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={async () => {
                    await likeComment();
                    setLiked("like");
                    // setNotify(true);
                  }}
                  disabled={liked === "like"}
                >
                  <CustomIcon
                    name="sentiment-satisfied"
                    size={20}
                    color={
                      liked === "like"
                        ? themeSchema[theme].colorText3
                        : "#F47658"
                    }
                    viewBcolor={liked === "like" ? "#F47658" : "transparent"}
                    viewRadius={liked === "like" ? 100 : 0}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    setLiked("dislike");
                    await dislikeComment();
                    // setNotify(true);
                  }}
                  style={{ marginLeft: 22 }}
                  disabled={liked === "dislike"}
                >
                  <CustomIcon
                    color="#000"
                    name="sentiment-dissatisfied"
                    size={20}
                    color={
                      liked === "dislike"
                        ? themeSchema[theme].colorText3
                        : themeSchema[theme].colorText
                    }
                    viewBcolor={
                      liked === "dislike"
                        ? themeSchema[theme].colorText
                        : "transparent"
                    }
                    viewRadius={liked === "dislike" ? 100 : 0}
                  />
                </TouchableOpacity>
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
        style={{
          ...styles.seedContainer,
          backgroundColor: themeSchema[theme].backgroundColor1,
        }}
      >
        <Comments
          theme={theme}
          navigation={navigation}
          comment={comment}
          comments={comments}
          setComments={setComments}
          loading={loading}
          currentUser={currentUser}
        />
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
        <View
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
            editable={!comment.debate.closed}
            multiline
            placeholder={i18n._("yourComment")}
            value={newComment}
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
            onChangeText={(nc) => setNewComment(nc)}
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
              onPress={async () => {
                Keyboard.dismiss();
                // const newObjectComment = {
                //   from:
                // };
                // const newObjectCommentRequest = {

                // };
                // setComments((commentList) => [...commentList,]);
                // setNewComment("");
                setNoMoreData(false);
                await createSubComment({
                  variables: {
                    from: currentUser.email,
                    content: newComment,
                    debate: comment.debate.id,
                    comment: comment.id,
                  },
                });
                setNewComment("");
              }}
              disabled={newComment.length <= 0 || comment.debate.closed}
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

    // marginTop: 10,
  },
  pseudo: {
    marginLeft: 9,
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    // paddingTop: 6,
  },
  userPicture: {
    width: 40,
    height: 40,
    borderRadius: 30,
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
    shadowColor: "gray",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 20,
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
});

export default IsolateComment;
