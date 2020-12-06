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
} from "react-native";
import Header from "../Components/Header";
import { ActivityIndicator, withTheme } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import CommentBox from "../Components/CommentBox";
import Select from "../Components/Select";
import { useQuery, gql } from "@apollo/client";

const GET_SUBCOMMENTS = gql`
  query($commentId: ID!) {
    comment(where: { id: $commentId }) {
      id
      comments {
        id
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
        comments {
          id
        }
      }
    }
  }
`;

const Comments = (props) => {
  const [comments, setComments] = React.useState([]);
  const { data, loading, error, fetchMore } = useQuery(GET_SUBCOMMENTS, {
    variables: {
      commentId: props.comment.id,
    },
    onCompleted: (response) => {
      const { comment: queryResult } = response;
      setComments(queryResult.comments);
    },
  });

  const { comment, navigation } = props;
  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  return (
    <>
      {comments.map((c) => (
        <CommentBox comment={c} navigation={navigation} />
      ))}
    </>
  );
};

const IsolateComment = (props) => {
  const [newComment, setNewComment] = React.useState("");
  const [keyboardIsOpen, setKeyboardIsOpen] = React.useState(false);
  // const [keyboardHeight, setKeyboardHeight] = React.useState(0);

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

  const { navigation, route } = props;
  const { comment } = route.params;
  //   const { comments } = comment;

  return (
    <View style={styles.container}>
      <Header hidden />
      <View
        style={{
          height: 50,
          backgroundColor: "#FFFFFF",
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
          <CustomIcon name={"chevron-left"} size={38} />
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
                label: "Signaler le commentaire",
                value: "REPORT",
              },
            ]}
            selected={null}
            placeholder=""
            onSelect={(action) => console.log(action)}
            renderComponent={<CustomIcon name="more-vert" size={28} />}
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
        }}
      >
        <View style={styles.headDebate}>
          <TouchableOpacity
            onPress={() => {
              navigation.push("Profile", {
                userId: comment.from.pseudo,
              });
            }}
          >
            <Image
              source={{ uri: defaultProfile }}
              style={styles.userPicture}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.push("Profile", {
                userId: comment.from.pseudo,
              });
            }}
          >
            <Text style={styles.pseudo}>{comment.from.pseudo}</Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Montserrat_500Medium",
          }}
        >
          {comment.content}
        </Text>
        <View
          style={{
            height: 1,
            backgroundColor: "#DBDBDB",
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
          <TouchableOpacity onPress={() => {}}>
            <CustomIcon color="#F47658" name="sentiment-satisfied" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={{ marginLeft: 22 }}>
            <CustomIcon color="#000" name="sentiment-dissatisfied" size={20} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.seedContainer}>
        <Comments navigation={navigation} comment={comment} />
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
            backgroundColor: "#FFFFFF",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 10,
            flexDirection: "row",
          }}
        >
          <TextInput
            multiline
            placeholder="Votre commentaire"
            value={newComment}
            style={{
              width:
                Dimensions.get("screen").width - 55 - (keyboardIsOpen ? 45 : 0),
              minHeight: 40,
              maxHeight: 60,
              borderRadius: 10,
              backgroundColor: "#f7f7f7",
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
                <CustomIcon name="keyboard-hide" size={26} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
              <CustomIcon name="send" size={26} />
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

export default withTheme(IsolateComment);
