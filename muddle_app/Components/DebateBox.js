import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import CustomIcon from "./Icon";
import Select from "../Components/Select";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import hasVoted from "../Library/hasVoted";
import { useMutation, gql } from "@apollo/client";
import {
  SEND_BLUE_VOTE,
  SEND_RED_VOTE,
  SEND_POSITIVE_VOTE,
  SEND_NEGATIVE_VOTE,
} from "../gql/votes";
import { cloneDeepWith, findIndex, isNil } from "lodash";
import useEffectUpdate from "../Library/useEffectUpdate";
import { useIsFocused } from "@react-navigation/native";
import voteDispatch from "../Library/voteDispatch";

const DELETE_DEBATE = gql`
  mutation($debateId: ID!) {
    deleteMyDebate(debateId: $debateId) {
      id
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

const displayPercent = ({ votes, totalVotes, answer }) => {
  if (totalVotes === 0) return `0%\n${answer}`;
  return `${Math.round((votes / totalVotes) * 100)}%\n${answer}`;
};

const manageHeightButton = ({ answerOne, answerTwo }) => {
  const oneLine = 38;
  const twoLines = 55;
  const threeLines = 80;

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

const DebateBox = (props) => {
  const {
    debate,
    navigation,
    currentUser,
    setDebates,
    index: debateIndex,
    setHomeDebates,
    disabledVotes,
  } = props;

  // console.log(setDebates);
  const { theme } = React.useContext(ThemeContext);
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

  const isFocused = useIsFocused();
  React.useEffect(() => {
    const result = hasVoted({
      ...debate,
      currentUser,
    });
    setVoted(result);
  }, [isFocused]);

  useEffectUpdate(() => {
    if (voted === "pour") setPour((v) => v + 1);
    if (voted === "contre") setContre((v) => v + 1);
  }, [voted]);

  const votes = pour + contre;
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
              style={{ ...styles.pseudo, color: themeSchema[theme].colorText }}
            >
              {debate.type === "MUDDLE"
                ? debate.owner.firstname
                : `${debate.owner.firstname} ${debate.owner.lastname}`}
            </Text>
          </TouchableOpacity>
          <View style={{ marginLeft: "auto" }}>
            <Select
              list={[
                currentUser.id !== debate.owner.id
                  ? {
                      label: i18n._("reportDebate"),
                      value: "REPORT",
                    }
                  : null,
                currentUser.id === debate.owner.id && !debate.closed
                  ? {
                      label: i18n._("closeDebate"),
                      value: "CLOSE",
                    }
                  : null,
                currentUser.id === debate.owner.id
                  ? {
                      label: i18n._("deleteDebate"),
                      value: "DELETE",
                    }
                  : null,
              ]}
              placeholder=""
              onSelect={(action) => {
                if (action.value === "REPORT")
                  navigation.push("Report", {
                    type: "DEBATE",
                    content: debate,
                  });

                if (action.value === "DELETE") {
                  deleteDebate();
                }
                if (action.value === "CLOSE") {
                  closeDebate();
                }
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
              setDebates,
              debateIndex,
              setHomeDebates,
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
            onPress={async () => {
              setVoted("pour");
              voteDispatch({
                setDebates,
                setHomeDebates,
                debateIndex,
                voteType: "positives",
                currentUser,
                debate,
              });
              await sendPositiveVote();
            }}
            style={
              voted
                ? {
                    ...styles.votePourButton,
                    height: manageHeightButton(debate),
                    backgroundColor:
                      voted === "pour"
                        ? "#F47658"
                        : themeSchema[theme].backgroundColor2,
                  }
                : {
                    ...styles.votePourButton,
                    height: manageHeightButton(debate),
                    backgroundColor: themeSchema[theme].backgroundColor2,
                  }
            }
            disabled={voted || disabledVotes || debate.closed}
          >
            <Text
              // numberOfLines={1}
              style={{
                color: themeSchema[theme].colorText,
                fontSize: 12,
                textAlign: "center",
                paddingLeft: 12,
                paddingRight: 12,
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
                    backgroundColor: themeSchema[theme].backgroundColor2,
                    borderColor: themeSchema[theme].colorText,
                    height: manageHeightButton(debate),
                  }
            }
            onPress={async () => {
              setVoted("contre");
              voteDispatch({
                setDebates,
                setHomeDebates,
                debateIndex,
                voteType: "negatives",
                currentUser,
                debate,
              });
              await sendNegativeVote();
            }}
            disabled={voted || disabledVotes || debate.closed}
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
              alignSelf: "center",
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
                  (currentUser.id === debate.ownerRed.id ||
                    currentUser.id === debate.ownerBlue.id) &&
                  !debate.closed
                    ? {
                        label: i18n._("askCloseDebate"),
                        value: "CLOSE",
                      }
                    : null,
                  currentUser.id === debate.ownerRed.id ||
                  currentUser.id === debate.ownerBlue.id
                    ? {
                        label: i18n._("askDeleteDebate"),
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
                  // if (action.value === "DELETE") {
                  //   deleteDebate();
                  // }
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
                setDebates,
                debateIndex,
                setHomeDebates,
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
              onPress={async () => {
                setVoted("pour");
                voteDispatch({
                  setDebates,
                  setHomeDebates,
                  debateIndex,
                  voteType: "blueVotes",
                  currentUser,
                  debate,
                });
                await sendBlueVote();
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
                      backgroundColor: themeSchema[theme].backgroundColor2,
                      height: manageHeightButton(debate),
                    }
              }
              disabled={voted || disabledVotes || debate.closed}
            >
              <Text
                // numberOfLines={1}
                style={{
                  color: themeSchema[theme].colorText,
                  fontSize: 12,
                  paddingLeft: 12,
                  paddingRight: 12,
                  fontFamily:
                    voted === "pour"
                      ? "Montserrat_600SemiBold"
                      : "Montserrat_500Medium",
                  textAlign: "center",
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
              onPress={async () => {
                setVoted("contre");
                voteDispatch({
                  setDebates,
                  setHomeDebates,
                  debateIndex,
                  voteType: "redVotes",
                  currentUser,
                  debate,
                });
                await sendRedVote();
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
                      backgroundColor: themeSchema[theme].backgroundColor2,
                      borderColor: themeSchema[theme].colorText,
                      height: manageHeightButton(debate),
                    }
              }
              disabled={voted || disabledVotes || debate.closed}
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
    maxHeight: 340,
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
    // flexDirection: "row",
    backgroundColor: "#fff",
    paddingTop: 2,
    // paddingLeft: 30,
    // paddingRight: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#F47658",
    borderStyle: "solid",
    // height: 36,
    alignItems: "center",
    // alignContent: "center",
    justifyContent: "center",
    width: 108,
    // overflow: "visible",
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
    // height: 36,
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
  disabledVotes: PropTypes.bool,
};

DebateBox.defaultProps = {
  // type: "STANDARD",
  disabledVotes: false,
};

export default DebateBox;
