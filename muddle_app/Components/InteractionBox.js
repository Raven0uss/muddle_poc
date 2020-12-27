import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import CustomIcon from "./Icon";
import Select from "../Components/Select";
import DebateBox from "./DebateBox";
import CommentBox from "./CommentBox";
import i18n from "../i18n";
import themeSchema from "../CustomProperties/Theme";
import UserContext from "../CustomProperties/UserContext";
import getTimeSpent from "../Library/getTimeSpent";

const getVote = ({ interactionType, answerOne, answerTwo }) => {
  if (interactionType === "POSITIVE_VOTE" || interactionType === "BLUE_VOTE")
    return `"${answerOne}"`;
  if (interactionType === "NEGATIVE_VOTE" || interactionType === "RED_VOTE")
    return `"${answerTwo}"`;
  return "";
};

const InteractionBox = (props) => {
  const { currentUser } = React.useContext(UserContext);
  const { interaction, navigation, theme, setHomeDebates, setDebates } = props;
  const { comment, debate } = interaction;

  // console.log(debate);
  switch (interaction.type) {
    case "LIKE":
      return (
        <View
          style={{
            ...styles.notificationBox,
            backgroundColor: themeSchema[theme].backgroundColor2,
          }}
        >
          <Text
            style={{
              ...styles.notificationText,
              color: themeSchema[theme].colorText,
            }}
          >
            {`${
              interaction.who.id === currentUser.id
                ? i18n._("youLiked")
                : `${interaction.who.firstname} ${
                    interaction.who.lastname
                  } ${i18n._("liked")}`
            } ${i18n._("that")} ${getTimeSpent(interaction.updatedAt)}`}
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: "#DBDBDB",
              width: "100%",
              alignSelf: "center",
              marginTop: 5,
              // marginBottom: 10,
            }}
          />
          {/* <TouchableOpacity
            onPress={() =>
              navigation.push("Debate", {
                debate: comment.debate,
              })ues
            }
          > */}
          <CommentBox
            theme={theme}
            comment={comment}
            navigation={navigation}
            currentUser={currentUser}
          />
          {/* </TouchableOpacity> */}
        </View>
      );
    case "DISLIKE":
      return (
        <View
          style={{
            ...styles.notificationBox,
            backgroundColor: themeSchema[theme].backgroundColor2,
          }}
        >
          <Text
            style={{
              ...styles.notificationText,
              color: themeSchema[theme].colorText,
            }}
          >
            {`${
              interaction.who.id === currentUser.id
                ? i18n._("youDidntLiked")
                : `${interaction.who.firstname} ${
                    interaction.who.lastname
                  } ${i18n._("didntLiked")}`
            } ${i18n._("that")} ${getTimeSpent(interaction.updatedAt)}`}
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: "#DBDBDB",
              width: "100%",
              alignSelf: "center",
              marginTop: 5,
            }}
          />
          {/* <TouchableOpacity
            onPress={() =>
              navigation.push("Debate", {
                debate: comment.debate,
              })
            }
          > */}
          <CommentBox
            theme={theme}
            comment={comment}
            navigation={navigation}
            currentUser={currentUser}
          />

          {/* </TouchableOpacity> */}
        </View>
      );
    case "COMMENT":
      return (
        <View
          style={{
            ...styles.notificationBox,
            backgroundColor: themeSchema[theme].backgroundColor2,
          }}
        >
          <Text
            style={{
              ...styles.notificationText,
              color: themeSchema[theme].colorText,
            }}
          >
            {`${
              interaction.who.id === currentUser.id
                ? i18n._("youCommented")
                : `${interaction.who.firstname} ${
                    interaction.who.lastname
                  } ${i18n._("commented")}`
            } ${i18n._("onThisDebate")} ${getTimeSpent(interaction.updatedAt)}`}
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: "#DBDBDB",
              width: "100%",
              alignSelf: "center",
              marginTop: 5,
              marginBottom: 10,
            }}
          />
          <DebateBox
            theme={theme}
            debate={comment.debate}
            navigation={navigation}
            currentUser={currentUser}
            setDebates={setDebates}
            setHomeDebates={setHomeDebates}
            // disabledVotes
          />
        </View>
      );
    case "BLUE_VOTE":
    case "RED_VOTE":
    case "POSITIVE_VOTE":
    case "NEGATIVE_VOTE":
      return (
        <View
          style={{
            ...styles.notificationBox,
            backgroundColor: themeSchema[theme].backgroundColor2,
          }}
        >
          <Text
            style={{
              ...styles.notificationText,
              color: themeSchema[theme].colorText,
            }}
          >
            {`${
              interaction.who.id === currentUser.id
                ? i18n._("youVote")
                : `${interaction.who.firstname} ${
                    interaction.who.lastname
                  } ${i18n._("hasVote")}`
            } ${getVote({
              interactionType: interaction.type,
              answerOne: debate.answerOne,
              answerTwo: debate.answerTwo,
            })} ${getTimeSpent(interaction.updatedAt)}`}
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: "#DBDBDB",
              width: "100%",
              alignSelf: "center",
              marginTop: 5,
              marginBottom: 10,
            }}
          />
          <DebateBox
            currentUser={currentUser}
            theme={theme}
            debate={debate}
            navigation={navigation}
            setDebates={setDebates}
            setHomeDebates={setHomeDebates}
            // disabledVotes
          />
        </View>
      );
    // case "RED_VOTE":
    //   return (
    //     <View style={styles.notificationBox}>
    //       <Text style={styles.notificationText}>
    //         {`${
    //           interaction.who.pseudo === "userA"
    //             ? "Vous avez vote du cote rouge"
    //             : `${interaction.who.pseudo} a vote du cote rouge`
    //         } il y a 2 heures`}
    //       </Text>
    //       <View
    //         style={{
    //           height: 1,
    //           backgroundColor: "#DBDBDB",
    //           width: "100%",
    //           alignSelf: "center",
    //           marginTop: 5,
    //           marginBottom: 10,
    //         }}
    //       />
    //       <DebateBox debate={debate} navigation={navigation} />
    //     </View>
    //   );
    // case "POSITIVE_VOTE":
    //   return (
    //     <View style={styles.notificationBox}>
    //       <Text style={styles.notificationText}>
    //         {`${
    //           interaction.who.pseudo === "userA"
    //             ? "Vous avez vote"
    //             : `${interaction.who.pseudo} a vote`
    //         } favorablement sur ce debat il y a 2 heures`}
    //       </Text>
    //       <View
    //         style={{
    //           height: 1,
    //           backgroundColor: "#DBDBDB",
    //           width: "100%",
    //           alignSelf: "center",
    //           marginBottom: 10,
    //           marginTop: 5,
    //         }}
    //       />
    //       <DebateBox debate={debate} navigation={navigation} />
    //     </View>
    //   );
    // case "NEGATIVE_VOTE":
    //   return (
    //     <View style={styles.notificationBox}>
    //       <Text style={styles.notificationText}>
    //         {`${
    //           interaction.who.pseudo === "userA"
    //             ? "Vous avez vote"
    //             : `${interaction.who.pseudo} a vote`
    //         } defavorablement sur ce debat il y a 2 heures`}
    //       </Text>
    //       <View
    //         style={{
    //           height: 1,
    //           backgroundColor: "#DBDBDB",
    //           width: "100%",
    //           alignSelf: "center",
    //           marginBottom: 10,
    //           marginTop: 5,
    //         }}
    //       />
    //       <DebateBox debate={debate} navigation={navigation} />
    //     </View>
    //   );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
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
  headDebate: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },

  notificationBox: {
    width: "90%",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 0,
    marginBottom: 10, // android
    padding: 15,
  },
  notificationText: {
    fontSize: 10,
    fontFamily: "Montserrat_500Medium",
  },
});

export default InteractionBox;
