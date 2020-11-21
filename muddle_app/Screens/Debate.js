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
  const votes = debate.negatives.length + debate.positives.length;
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
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 3 }}
        >
          <CustomIcon name={"chevron-left"} size={38} />
        </TouchableOpacity>
      </View>
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
          <View style={{ marginLeft: "auto" }}>
            <TouchableOpacity>
              <CustomIcon name="more-vert" size={22} />
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
          <TouchableOpacity onPress={() => {}} style={styles.voteContreButton}>
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
      <ScrollView style={styles.seedContainer}>
        <View
          style={{
            width: "100%",
            height: 100,
            borderRadius: 10,
            backgroundColor: "#fff",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 5,
            marginBottom: 5,
          }}
        ></View>

        <View
          style={{
            width: "100%",
            height: 100,
            borderRadius: 10,
            backgroundColor: "#fff",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 13,
            marginBottom: 10, // android
          }}
        ></View>
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
    marginTop: 10,
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
});

export default withTheme(Debate);
