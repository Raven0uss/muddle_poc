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
import { withTheme } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import CommentBox from "../Components/CommentBox";
import Select from "../Components/Select";

const Debate = (props) => {
  const [comment, setComment] = React.useState("");
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

  const { debate } = route.params;
  const votes =
    debate.type === "STANDARD" || debate.type === "MUDDLE"
      ? debate.negatives.length + debate.positives.length
      : debate.redVotes.length + debate.blueVotes.length;
  const comments = debate.comments.length;

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
                label: "Signaler le debat",
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

      {(debate.type === "STANDARD" || debate.type === "MUDDLE") && (
        <View style={styles.boxDebate}>
          <View style={styles.headDebate}>
            <TouchableOpacity>
              <Image
                source={{ uri: defaultProfile }}
                style={styles.userPicture}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.pseudo}>{debate.owner.pseudo}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Debate", {
                debate,
              });
            }}
          >
            <Text style={styles.debateText}>{debate.content}</Text>
          </TouchableOpacity>
          <View
            style={{
              height: 1,
              backgroundColor: "#DBDBDB",
              width: "100%",
              alignSelf: "center",
            }}
          />
          <View style={styles.debateFooter}>
            <Text style={styles.footerText}>{`${votes} vote${
              votes > 1 ? "s" : ""
            }`}</Text>
            <Text style={styles.footerText}>{`${comments} commentaire${
              comments > 1 ? "s" : ""
            }`}</Text>
          </View>
          <View style={styles.debateActions}>
            <TouchableOpacity onPress={() => {}} style={styles.votePourButton}>
              <Text
                numberOfLines={1}
                style={{
                  color: "#000",
                  fontSize: 12,
                  paddingLeft: 12,
                  paddingRight: 12,
                }}
              >
                Je suis pour
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={styles.voteContreButton}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: "#000",
                  fontSize: 12,
                  paddingLeft: 6,
                  paddingRight: 6,
                }}
              >
                Je suis contre
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} style={styles.commentButton}>
              <CustomIcon name="more-horiz" size={28} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {debate.type === "DUO" && (
        <View style={styles.boxDebate}>
          <View style={styles.headDebateDuo}>
            <View style={{ alignItems: "flex-start" }}>
              <TouchableOpacity>
                <Image
                  source={{ uri: defaultProfile }}
                  style={styles.userPictureBlue}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.pseudoDuo}>{debate.ownerBlue.pseudo}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <TouchableOpacity>
                <Image
                  source={{ uri: defaultProfile }}
                  style={styles.userPictureRed}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.pseudoDuo}>{debate.ownerRed.pseudo}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Debate", {
                debate,
              });
            }}
          >
            <Text numberOfLines={8} style={styles.debateTextDuo}>
              {debate.content}
            </Text>
          </TouchableOpacity>
          <View style={styles.debateActionsDuo}>
            <TouchableOpacity onPress={() => {}} style={styles.voteBlueButton}>
              <Text
                numberOfLines={1}
                style={{
                  color: "#000",
                  fontSize: 12,
                  paddingLeft: 12,
                  paddingRight: 12,
                }}
              >
                Je suis pour
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Debate", {
                  debate,
                });
              }}
              style={styles.commentDuoButton}
            >
              <CustomIcon name="more-horiz" size={28} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} style={styles.voteRedButton}>
              <Text
                numberOfLines={1}
                style={{
                  color: "#000",
                  fontSize: 12,
                  paddingLeft: 6,
                  paddingRight: 6,
                }}
              >
                Je suis contre
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: "#DBDBDB",
              width: "100%",
              alignSelf: "center",
              marginTop: 15,
            }}
          />
          <View style={styles.debateFooter}>
            <Text style={styles.footerText}>{`${votes} vote${
              votes > 1 ? "s" : ""
            }`}</Text>
            <Text style={styles.footerText}>{`${comments} commentaire${
              comments > 1 ? "s" : ""
            }`}</Text>
          </View>
        </View>
      )}
      <ScrollView style={styles.seedContainer}>
        {debate.comments.map((comment) => (
          <CommentBox comment={comment} />
        ))}
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
            value={comment}
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
              // marginBottom: 20,
            }}
            keyboardType="default"
            onChangeText={(c) => setComment(c)}
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
  },
  debateFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
  },
  footerText: {
    fontSize: 10,
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
    fontWeight: "bold",
    fontSize: 14,
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
    borderWidth: 6,
    borderColor: "#6194EC80",
  },
  userPictureRed: {
    width: 52,
    height: 52,
    borderRadius: 30,
    borderWidth: 6,
    borderColor: "#F6577780",
  },
  pseudoDuo: {
    // marginLeft: 9,
    fontWeight: "500",
    fontSize: 12,
    // paddingTop: 6,
    marginTop: 3,
  },
  headDebateDuo: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  debateTextDuo: {
    fontSize: 12,
    paddingBottom: 10,
    textAlign: "center",
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
    borderColor: "#6194EC",
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

export default withTheme(Debate);
