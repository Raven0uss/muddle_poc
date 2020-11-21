import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import CustomIcon from "./Icon";

const DebateBox = (props) => {
  const { debate, navigation } = props;

  const votes = debate.negatives.length + debate.positives.length;
  const comments = debate.comments.length;
  return (
    <View style={styles.boxDebate}>
      <View style={styles.headDebate}>
        <TouchableOpacity>
          <Image source={{ uri: defaultProfile }} style={styles.userPicture} />
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
        <Text numberOfLines={8} style={styles.debateText}>
          {debate.content}
        </Text>
      </TouchableOpacity>
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
  );
};

const styles = StyleSheet.create({
  boxDebate: {
    maxHeight: 248,
    backgroundColor: "white",
    elevation: 10,
    borderRadius: 7,
    padding: 10,
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
    borderBottomWidth: 2,
    borderBottomColor: "#DBDBDB",
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

DebateBox.propTypes = {
  // type: PropTypes.oneOf(["STANDARD", "DUO", "MUDDLE"]),
};

DebateBox.defaultProps = {
  // type: "STANDARD",
};

export default DebateBox;
