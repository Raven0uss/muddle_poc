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
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import CommentBox from "../Components/CommentBox";
import Select from "../Components/Select";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";

const Debate = (props) => {
  const { theme } = React.useContext(ThemeContext);
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
              {
                label: i18n._("reportDebate"),
                value: "REPORT",
              },
            ]}
            selected={null}
            placeholder=""
            onSelect={(action) => {
              if (action.value === "REPORT")
                navigation.push("Report", {
                  type: "DEBATE",
                  content: debate,
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

      {(debate.type === "STANDARD" || debate.type === "MUDDLE") && (
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
                {`${debate.owner.firstname} ${debate.owner.lastname}`}
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              ...styles.debateText,
              color: themeSchema[theme].colorText,
            }}
          >
            {debate.content}
          </Text>
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
            >{`${comments} ${i18n._("comment")}${
              comments > 1 ? "s" : ""
            }`}</Text>
          </View>
          <View style={styles.debateActions}>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                ...styles.votePourButton,
                backgroundColor: themeSchema[theme].backgroundColor2,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: themeSchema[theme].colorText,
                  fontSize: 12,
                  paddingLeft: 12,
                  paddingRight: 12,
                  fontFamily: "Montserrat_500Medium",
                }}
              >
                {debate.answerOne}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                ...styles.voteContreButton,
                backgroundColor: themeSchema[theme].backgroundColor2,
                borderColor: themeSchema[theme].colorText,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: themeSchema[theme].colorText,
                  fontSize: 12,
                  paddingLeft: 6,
                  paddingRight: 6,
                  fontFamily: "Montserrat_500Medium",
                }}
              >
                {debate.answerTwo}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                ...styles.commentButton,
                backgroundColor: themeSchema[theme].backgroundColor2,
                borderColor: themeSchema[theme].colorText,
              }}
            >
              <CustomIcon
                name="more-horiz"
                size={28}
                color={themeSchema[theme].colorText}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {debate.type === "DUO" && (
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
            numberOfLines={8}
            style={{
              ...styles.debateTextDuo,
              color: themeSchema[theme].colorText,
            }}
          >
            {debate.content}
          </Text>
          <View style={styles.debateActionsDuo}>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                ...styles.voteBlueButton,
                backgroundColor: themeSchema[theme].backgroundColor2,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: themeSchema[theme].colorText,
                  fontSize: 12,
                  paddingLeft: 12,
                  paddingRight: 12,
                  fontFamily: "Montserrat_500Medium",
                }}
              >
                {debate.answerOne}
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
              }}
            >
              <CustomIcon
                name="more-horiz"
                size={28}
                color={themeSchema[theme].colorText}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                ...styles.voteRedButton,
                backgroundColor: themeSchema[theme].backgroundColor2,
                borderColor: themeSchema[theme].colorText,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: themeSchema[theme].colorText,
                  fontSize: 12,
                  paddingLeft: 6,
                  paddingRight: 6,
                  fontFamily: "Montserrat_500Medium",
                }}
              >
                {debate.answerTwo}
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
            >{`${comments} ${i18n._("comment")}${
              comments > 1 ? "s" : ""
            }`}</Text>
          </View>
        </View>
      )}
      <ScrollView
        style={{
          ...styles.seedContainer,
          backgroundColor: themeSchema[theme].backgroundColor1,
        }}
      >
        {debate.comments
          .filter((comment) => comment.nested === false)
          .map((comment) => (
            <CommentBox
              theme={theme}
              comment={comment}
              navigation={navigation}
            />
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
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
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
