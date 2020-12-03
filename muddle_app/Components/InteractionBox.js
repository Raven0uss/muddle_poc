import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import CustomIcon from "./Icon";
import Select from "../Components/Select";
import DebateBox from "./DebateBox";
import CommentBox from "./CommentBox";

const InteractionBox = (props) => {
  const { interaction, navigation } = props;
  const { comment, debate } = interaction;

  console.log(debate);
  switch (interaction.type) {
    case "LIKE":
      return (
        <View style={styles.notificationBox}>
          <Text style={styles.notificationText}>
            {`${
              interaction.who.pseudo === "userA"
                ? "Vous avez aime"
                : `${interaction.who.pseudo} a aime`
            } ceci il y a 2 heures`}
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
          <CommentBox comment={comment} navigation={navigation} />
        </View>
      );
    case "DISLIKE":
      return (
        <View style={styles.notificationBox}>
          <Text style={styles.notificationText}>
            {`${
              interaction.who.pseudo === "userA"
                ? "Vous n'avez pas aime"
                : `${interaction.who.pseudo} n'a pas aime`
            } ceci il y a 2 heures`}
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
          <CommentBox comment={comment} navigation={navigation} />
        </View>
      );
    case "COMMENT":
      return (
        <View style={styles.notificationBox}>
          <Text style={styles.notificationText}>
            {`${
              interaction.who.pseudo === "userA"
                ? "Vous avez commente"
                : `${interaction.who.pseudo} a commente`
            } sur ce debat il y a 2 heures`}
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
          <DebateBox debate={comment.debate} navigation={navigation} />
        </View>
      );
    case "BLUE_VOTE":
      return (
        <View style={styles.notificationBox}>
          <Text style={styles.notificationText}>
            {`${
              interaction.who.pseudo === "userA"
                ? "Vous avez vote du cote bleu"
                : `${interaction.who.pseudo} a vote du cote bleu`
            } il y a 2 heures`}
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
          <DebateBox debate={debate} navigation={navigation} />
        </View>
      );
    case "RED_VOTE":
      return (
        <View style={styles.notificationBox}>
          <Text style={styles.notificationText}>
            {`${
              interaction.who.pseudo === "userA"
                ? "Vous avez vote du cote rouge"
                : `${interaction.who.pseudo} a vote du cote rouge`
            } il y a 2 heures`}
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
          <DebateBox debate={debate} navigation={navigation} />
        </View>
      );
    case "POSITIVE_VOTE":
      return (
        <View style={styles.notificationBox}>
          <Text style={styles.notificationText}>
            {`${
              interaction.who.pseudo === "userA"
                ? "Vous avez vote"
                : `${interaction.who.pseudo} a vote`
            } favorablement sur ce debat il y a 2 heures`}
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: "#DBDBDB",
              width: "100%",
              alignSelf: "center",
              marginBottom: 10,
              marginTop: 5,
            }}
          />
          <DebateBox debate={debate} navigation={navigation} />
        </View>
      );
    case "NEGATIVE_VOTE":
      return (
        <View style={styles.notificationBox}>
          <Text style={styles.notificationText}>
            {`${
              interaction.who.pseudo === "userA"
                ? "Vous avez vote"
                : `${interaction.who.pseudo} a vote`
            } defavorablement sur ce debat il y a 2 heures`}
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: "#DBDBDB",
              width: "100%",
              alignSelf: "center",
              marginBottom: 10,
              marginTop: 5,
            }}
          />
          <DebateBox debate={debate} navigation={navigation} />
        </View>
      );
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
    marginTop: 13,
    marginBottom: 10, // android
    padding: 15,
  },
  notificationText: {
    fontSize: 10,
  },
});

export default InteractionBox;
