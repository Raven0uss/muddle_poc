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

const GET_SUBCOMMENTS = gql`
  query($commentId: ID!) {
    comment(where: { id: $commentId }) {
      id
      debate {
        id
      }
      comments {
        id
        debate {
          id
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

const Comments = (props) => {
  const { comments, loading, comment, navigation, theme } = props;

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  return (
    <>
      {comments.map((c) => (
        <CommentBox
          theme={theme}
          comment={c}
          navigation={navigation}
          key={c.id}
          debateId={c.debate.id}
        />
      ))}
    </>
  );
};

const IsolateComment = (props) => {
  const { navigation, route } = props;
  const { comment } = route.params;

  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);
  const [liked, setLiked] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [newComment, setNewComment] = React.useState("");
  const [keyboardIsOpen, setKeyboardIsOpen] = React.useState(false);
  // const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_SUBCOMMENTS,
    {
      variables: {
        commentId: comment.id,
      },
      onCompleted: (response) => {
        const { comment: queryResult } = response;
        setComments(queryResult.comments);
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
    }
  );

  const [createSubComment] = useMutation(CREATE_SUBCOMMENT, {
    onCompleted: async () => {
      await refetch();
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
              {
                label: i18n._("reportComment"),
                value: "REPORT",
              },
            ]}
            selected={null}
            placeholder=""
            onSelect={(action) => {
              if (action.value === "REPORT")
                navigation.push("Report", {
                  type: "COMMENT",
                  content: comment,
                });
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
              style={{ ...styles.pseudo, color: themeSchema[theme].colorText }}
            >
              {`${comment.from.firstname} ${comment.from.lastname}`}
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Montserrat_500Medium",
            color: themeSchema[theme].colorText,
          }}
        >
          {comment.content}
        </Text>
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
            onPress={() => {
              setLiked("like");
            }}
            disabled={liked === "like"}
          >
            <CustomIcon
              name="sentiment-satisfied"
              size={20}
              color={
                liked === "like" ? themeSchema[theme].colorText3 : "#F47658"
              }
              viewBcolor={liked === "like" ? "#F47658" : "transparent"}
              viewRadius={liked === "like" ? 100 : 0}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLiked("dislike");
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
      <ScrollView
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
        />
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : ""}
        style={
          Platform.OS === "android" &&
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
              onPress={() => {
                Keyboard.dismiss();
                // const newObjectComment = {
                //   from:
                // };
                // const newObjectCommentRequest = {

                // };
                // setComments((commentList) => [...commentList,]);
                // setNewComment("");

                createSubComment({
                  variables: {
                    from: currentUser.email,
                    content: newComment,
                    debate: comment.debate.id,
                    comment: comment.id,
                  },
                });
                setNewComment("");
              }}
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
    paddingLeft: 15,
    paddingRight: 15,
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
