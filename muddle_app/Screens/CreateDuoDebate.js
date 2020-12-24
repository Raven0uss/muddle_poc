import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import Header from "../Components/Header";
import CustomIcon from "../Components/Icon";
import { defaultProfile, muddle } from "../CustomProperties/IconsBase64";

import i18n from "../i18n";
import { gql, useMutation } from "@apollo/client";
import ThemeContext from "../CustomProperties/ThemeContext";
import UserContext from "../CustomProperties/UserContext";
import themeSchema from "../CustomProperties/Theme";

import { isEmpty } from "lodash";

const PUBLISH_DUO_DEBATE = gql`
  mutation($debateId: ID!, $answerTwo: String!, $timelimit: String!) {
    publishDuoDebate(
      answerTwo: $answerTwo
      debateId: $debateId
      timelimit: $timelimit
    ) {
      id
    }
  }
`;

const publishDuoDebate = async ({
  id,
  answerTwo,
  timelimit,
  reqPublishDuoDebate,
}) => {
  await reqPublishDuoDebate({
    variables: {
      debateId: id,
      timelimit,
      answerTwo,
    },
  });
};

const CreateDuoDebate = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);

  const [optionOne, setOptionOne] = React.useState("");

  const { navigation, route } = props;
  const { debate, notificationId, updateNotification } = route.params;

  const [reqPublishDuoDebate] = useMutation(PUBLISH_DUO_DEBATE, {
    onCompleted: () => {
      updateNotification({
        variables: {
          notificationId,
          status: "ACCEPTED",
        },
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    },
  });

  const arrTL = debate.timelimitString.split(" ");
  const objTL = {
    days: arrTL[0],
    hours: arrTL[1],
  };

  const disabledButton = isEmpty(optionOne);

  return (
    <View style={styles.container}>
      <Header
        LeftComponent={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginTop: 3 }}
          >
            <CustomIcon name={"chevron-left"} size={38} />
          </TouchableOpacity>
        }
        MiddleComponent={
          <Image
            source={{ uri: muddle.nb }}
            style={{
              width: 50,
              height: 28,
              marginTop: 8,
              marginLeft: -32,
              marginBottom: 10,
            }}
          />
        }
      />
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          ...styles.seedContainer,
          backgroundColor: themeSchema[theme].backgroundColor2,
        }}
      >
        <ScrollView>
          <Text
            style={{
              fontFamily: "Montserrat_700Bold",
              fontSize: 14,
              marginTop: 30,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            {i18n._("duoDebate")}
          </Text>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Image
              source={{ uri: debate.ownerRed.profilePicture }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
              }}
            />
            <Text
              style={{
                fontFamily: "Montserrat_600SemiBold",
                alignSelf: "center",
                marginLeft: 5,
                fontSize: 12,
                width: 100,
              }}
            >{`${debate.ownerRed.firstname} ${debate.ownerRed.lastname}`}</Text>
            <View
              style={{
                flexDirection: "row",
                marginLeft: "auto",
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                  alignSelf: "center",
                  marginRight: 5,
                  fontSize: 12,
                  width: 100,
                  textAlign: "right",
                }}
              >{`${debate.ownerBlue.firstname} ${debate.ownerBlue.lastname}`}</Text>
              <Image
                source={{ uri: debate.ownerBlue.profilePicture }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                }}
              />
            </View>
          </View>
          <View
            style={{
              marginTop: 10,
              backgroundColor: "#F7F7F7",
              padding: 15,
              borderRadius: 12,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat_500Medium",
                fontSize: 12,
              }}
            >
              {i18n._("debateDuration")}
            </Text>
            <View
              style={{
                // backgroundColor: ""
                marginLeft: "auto",
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat_500Medium",
                  fontSize: 12,
                }}
              >{`${objTL.days} jours et ${parseInt(
                objTL.hours,
                10
              )} heures`}</Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#F7F7F7",
              marginTop: 10,
              padding: 20,
              borderRadius: 14,
            }}
          >
            <Text style={{ fontFamily: "Montserrat_500Medium", fontSize: 12 }}>
              {debate.content}
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              borderRadius: 20,
              backgroundColor: themeSchema[theme].backgroundColor1,
              height: 100,
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TextInput
              placeholder={i18n._("yourOpinion")}
              value={optionOne}
              onChangeText={(oOne) => {
                if (oOne.length < 35)
                  setOptionOne(oOne.replace(/\r?\n|\r/g, ""));
              }}
              style={{
                ...styles.optionOne,
                color: themeSchema[theme].colorText,
                backgroundColor: themeSchema[theme].backgroundColor1,
              }}
              placeholderTextColor={themeSchema[theme].colorText}
              keyboardType="default"
              // placeholderTextColor="#222"
              numberOfLines={3}
              multiline={true}
              scrollEnabled={false}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              publishDuoDebate({
                id: debate.id,
                answerTwo: optionOne,
                timelimit: debate.timelimitString,
                reqPublishDuoDebate,
              });
            }}
            style={{
              alignSelf: "flex-end",
              backgroundColor: disabledButton ? "#d3d3d3" : "#F47658",
              padding: 12,
              paddingLeft: 30,
              paddingRight: 30,
              borderRadius: 30,
              marginTop: 20,
            }}
            disabled={disabledButton}
          >
            <Text style={{ color: "#000", fontFamily: "Montserrat_700Bold" }}>
              {i18n._("publish")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F47658",
  },
  seedContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#FFFFFF",
    paddingLeft: 15,
    paddingRight: 15,
    height: Dimensions.get("screen").height,
    flex: 1,
  },
  userPicture: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  inputSelect: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    paddingLeft: 20,
    paddingRight: 20,
    width: "100%",
    borderRadius: 10,
    color: "#000",
    marginBottom: 10,
    height: 40,
  },
  input: {
    backgroundColor: "#f7f7f7",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    width: "100%",
    borderRadius: 10,
    color: "#000",
    // marginBottom: 18,
    height: 120,
    // maxHeight: 1200,
    overflow: "scroll",
    fontFamily: "Montserrat_500Medium",
  },
  optionOne: {
    backgroundColor: "#f7f7f7",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    // width: "100%",
    borderRadius: 10,
    color: "#000",
    borderColor: "#F47658",
    borderWidth: 2,
    fontFamily: "Montserrat_500Medium",
    maxWidth: 128,
    fontSize: 10,
    textAlign: "center",
  },
  optionTwo: {
    backgroundColor: "#f7f7f7",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    // width: "100%",
    borderRadius: 10,
    color: "#000",
    borderColor: "#000",
    borderWidth: 2,
    fontFamily: "Montserrat_500Medium",
    maxWidth: 128,
    fontSize: 10,
    textAlign: "center",
  },
  connectionButton: {
    alignSelf: "flex-end",
    backgroundColor: "#F47658",
    padding: 12,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 30,
    marginTop: 20,
  },
  inputInvite: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    paddingLeft: 20,
    paddingRight: 20,
    width: "100%",
    borderRadius: 10,
    color: "#000",
    marginBottom: 10,
    height: 40,
    fontFamily: "Montserrat_500Medium",
  },
});

export default CreateDuoDebate;
