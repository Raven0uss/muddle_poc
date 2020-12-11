import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import CustomIcon from "./Icon";
import Select from "../Components/Select";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";

const DebateBox = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { debate, navigation } = props;

  const votes =
    debate.type === "STANDARD" || debate.type === "MUDDLE"
      ? debate.negatives.length + debate.positives.length
      : debate.redVotes.length + debate.blueVotes.length;
  const comments = debate.comments.length;
  if (debate.type === "STANDARD" || debate.type === "MUDDLE") {
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
                userId: debate.owner.pseudo,
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
                userId: debate.owner.pseudo,
              });
            }}
          >
            <Text
              style={{ ...styles.pseudo, color: themeSchema[theme].colorText }}
            >
              {debate.owner.pseudo}
            </Text>
          </TouchableOpacity>
          <View style={{ marginLeft: "auto" }}>
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
                  size={22}
                  color={themeSchema[theme].colorText}
                />
              }
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.push("Debate", {
              debate,
            });
          }}
        >
          <Text
            numberOfLines={8}
            style={{
              ...styles.debateText,
              color: themeSchema[theme].colorText,
            }}
          >
            {debate.content}
          </Text>
        </TouchableOpacity>
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
          >{`${comments} ${i18n._("comment")}${comments > 1 ? "s" : ""}`}</Text>
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
            onPress={() => {
              navigation.push("Debate", {
                debate,
              });
            }}
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
    );
  }
  if (debate.type === "DUO")
    return (
      <View>
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
                    userId: debate.ownerBlue.pseudo,
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
                    userId: debate.ownerBlue.pseudo,
                  });
                }}
              >
                <Text
                  style={{
                    ...styles.pseudoDuo,
                    color: themeSchema[theme].colorText,
                  }}
                >
                  {debate.ownerBlue.pseudo}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.push("Profile", {
                    userId: debate.ownerRed.pseudo,
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
                    userId: debate.ownerRed.pseudo,
                  });
                }}
              >
                <Text
                  style={{
                    ...styles.pseudoDuo,
                    color: themeSchema[theme].colorText,
                  }}
                >
                  {debate.ownerRed.pseudo}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                position: "absolute",
                right: 0,
                alignSelf: "flex-start",
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
                    size={22}
                    color={themeSchema[theme].colorText}
                  />
                }
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.push("Debate", {
                debate,
              });
            }}
          >
            <Text
              numberOfLines={8}
              style={{
                ...styles.debateTextDuo,
                color: themeSchema[theme].colorText,
              }}
            >
              {debate.content}
            </Text>
          </TouchableOpacity>
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
      </View>
    );
  return null;
};

const styles = StyleSheet.create({
  boxDebate: {
    maxHeight: 300,
    backgroundColor: "white",
    elevation: 4,
    borderRadius: 7,
    padding: 10,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "gray",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 10,
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
    width: 108,
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
    width: 108,
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
    fontFamily: "Montserrat_500Medium",
    marginTop: 10,
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
    width: 108,
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
    borderColor: "#000000",
    borderStyle: "solid",
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    width: 108,
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

DebateBox.propTypes = {
  // type: PropTypes.oneOf(["STANDARD", "DUO", "MUDDLE"]),
};

DebateBox.defaultProps = {
  // type: "STANDARD",
};

export default DebateBox;
