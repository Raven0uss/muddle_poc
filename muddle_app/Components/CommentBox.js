import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { defaultProfile } from "../CustomProperties/IconsBase64";
import CustomIcon from "./Icon";
import Select from "../Components/Select";
import i18n from "../i18n";
import themeSchema from "../CustomProperties/Theme";

const CommentBox = (props) => {
  const { comment, navigation, theme } = props;
  return (
    <View
      style={{
        width: "100%",
        borderRadius: 10,
        backgroundColor: themeSchema[theme].backgroundColor2,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 10,
        marginBottom: 3, // android
        padding: 15,
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
            source={{ uri: comment.from.profilePicture }}
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
          <Text
            style={{ ...styles.pseudo, color: themeSchema[theme].colorText }}
          >
            {comment.from.pseudo}
          </Text>
        </TouchableOpacity>
        <View style={{ marginLeft: "auto" }}>
          <Select
            list={[
              {
                label: i18n._("reportComment"),
                value: "REPORT",
              },
            ]}
            selected={null}
            placeholder=""
            onSelect={(action) => {
              if (action.value === "REPORT")
                navigation.push("Report", {
                  type: "COMMENT",
                  content: comment,
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
          navigation.push("IsolateComment", {
            comment,
          });
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Montserrat_500Medium",
            color: themeSchema[theme].colorText,
          }}
        >
          {comment.content}
        </Text>
      </TouchableOpacity>
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
          <CustomIcon
            color="#000"
            name="sentiment-dissatisfied"
            size={20}
            color={themeSchema[theme].colorText}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.push("IsolateComment", {
              comment,
            });
          }}
          style={{
            marginLeft: 22,
            backgroundColor: themeSchema[theme].backgroundColor1,
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
              color: themeSchema[theme].colorText,
            }}
          >
            {i18n._("answer")}
          </Text>
        </TouchableOpacity>
      </View>
      {comment.comments.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            navigation.push("IsolateComment", {
              comment,
            });
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat_400Regular",
              fontSize: 12,
              marginTop: 7,
              color: themeSchema[theme].colorText,
            }}
          >
            {`${i18n._("seeThe")} ${comment.comments.length} ${i18n._(
              "otherAnswers"
            )}`}
          </Text>
        </TouchableOpacity>
      )}
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
