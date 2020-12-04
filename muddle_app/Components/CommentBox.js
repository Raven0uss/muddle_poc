import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import CustomIcon from "./Icon";
import Select from "../Components/Select";

const CommentBox = (props) => {
  const { comment, navigation } = props;

  return (
    <View
      style={{
        width: "100%",
        borderRadius: 10,
        backgroundColor: "#fff",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 13,
        marginBottom: 10, // android
        padding: 15,
      }}
    >
      <View style={styles.headDebate}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Profile", {
              userId: comment.from.pseudo,
            });
          }}
        >
          <Image source={{ uri: defaultProfile }} style={styles.userPicture} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Profile", {
              userId: comment.from.pseudo,
            });
          }}
        >
          <Text style={styles.pseudo}>{comment.from.pseudo}</Text>
        </TouchableOpacity>
        <View style={{ marginLeft: "auto" }}>
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
            renderComponent={<CustomIcon name="more-vert" size={22} />}
          />
        </View>
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
        <TouchableOpacity
          onPress={() => {}}
          style={{
            marginLeft: 22,
            backgroundColor: "#F9F9F9",
            height: 29,
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat_500Medium",
              fontSize: 12,
            }}
          >
            Repondre
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
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
    fontFamily: "Montserrat_500Medium",
    // paddingTop: 6,
  },
  headDebate: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
});

export default CommentBox;
