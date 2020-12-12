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
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Header from "../Components/Header";
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import Select from "../Components/Select";
import DatePicker from "../Components/DatePicker";
import { useQuery, gql } from "@apollo/client";
import { defaultProfile, muddle } from "../CustomProperties/IconsBase64";
import moment from "moment";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import UserContext from "../CustomProperties/UserContext";
import strUcFirst from "../Library/strUcFirst";

const checkOnlyDigits = (str) => {
  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  for (let index = 0; index < str.length; index++) {
    const char = str[index];

    if (digits.indexOf(char) === -1) return false;
  }
  return true;
};

const GET_USERS = gql`
  query($firstname: String!, $lastname: String!) {
    users(
      where: {
        firstname_contains: $firstname
        lastname_contains: $lastname
        role_not: MUDDLE
      }
    ) {
      id
      firstname
      lastname
      certified
      email
      profilePicture
      coverPicture
      crowned
    }
  }
`;

const InvitationDebate = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);
  const [users, setUsers] = React.useState([]);
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [skipFetch, setSkipFetch] = React.useState(true);
  const { loading, error } = useQuery(GET_USERS, {
    variables: {
      firstname: strUcFirst(firstname),
      lastname: strUcFirst(lastname),
    },
    onCompleted: (response) => {
      const { users: queryResult } = response;

      setUsers(queryResult);
      setSkipFetch(true);
    },
    skip: skipFetch,
  });

  const { setShow, setDuo } = props;
  return (
    <View style={styles.container}>
      <Header hidden />
      <View
        style={{
          backgroundColor: themeSchema[theme].backgroundColor2,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: Dimensions.get("screen").width,
            marginTop: 33,
            marginBottom: 35,
          }}
        >
          <View
            style={{
              width: "60%",
            }}
          >
            <TextInput
              placeholder={i18n._("firstname")}
              value={firstname}
              style={{
                height: 40,
                borderRadius: 10,
                width: "100%",
                backgroundColor: themeSchema[theme].backgroundColor1,
                // marginLeft: "auto",
                // marginRight: "auto",
                padding: 10,
                paddingLeft: 20,
                paddingRight: 20,
                fontSize: 14,
                // marginBottom: 14,
                fontFamily: "Montserrat_500Medium",
                color: themeSchema[theme].colorText,
              }}
              keyboardType="default"
              placeholderTextColor={themeSchema[theme].colorText}
              onChangeText={(s) => setFirstname(s)}
            />
            <TextInput
              placeholder={i18n._("lastname")}
              value={lastname}
              style={{
                height: 40,
                borderRadius: 10,
                width: "100%",
                // marginLeft: 10,
                marginTop: 5,
                backgroundColor: themeSchema[theme].backgroundColor1,
                // marginLeft: "auto",
                // marginRight: "auto",
                padding: 10,
                paddingLeft: 20,
                paddingRight: 20,
                fontSize: 14,
                // marginBottom: 14,
                fontFamily: "Montserrat_500Medium",
                color: themeSchema[theme].colorText,
              }}
              keyboardType="default"
              placeholderTextColor={themeSchema[theme].colorText}
              onChangeText={(s) => setLastname(s)}
            />
          </View>
          <View>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F47658",
                marginLeft: 10,
                padding: 10,
                borderRadius: 10,
                marginBottom: 3,
              }}
              onPress={() => {
                Keyboard.dismiss();
                setSkipFetch(false);
              }}
              disabled={firstname.length < 3 && lastname.length < 3}
            >
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                  fontSize: 12,
                }}
              >
                {i18n._("search")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: themeSchema[theme].colorText,
                marginLeft: 10,
                padding: 10,
                borderRadius: 10,
                marginTop: 3,
              }}
              onPress={() => {
                Keyboard.dismiss();
                setShow(false);
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                  fontSize: 12,
                  color: themeSchema[theme].colorText3,
                }}
              >
                {i18n._("cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView
        style={{
          backgroundColor: themeSchema[theme].backgroundColor2,
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          users.map((u) => (
            <TouchableOpacity
              onPress={() => {
                setDuo(u);
                setShow(false);
              }}
            >
              <View
                style={{
                  backgroundColor: themeSchema[theme].backgroundColor1,
                  padding: 10,
                  flexDirection: "row",
                  marginTop: 5,
                  marginBottom: 10,
                  alignItems: "center",
                  borderRadius: 12,
                }}
              >
                <Image
                  source={{ uri: u.profilePicture }}
                  style={styles.userPicture}
                />

                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Montserrat_500Medium",
                    marginLeft: 10,
                    color: themeSchema[theme].colorText,
                  }}
                >
                  {`${u.firstname} ${u.lastname}`}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const CreateDebate = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);
  const [debateType, setDebateType] = React.useState({
    label: i18n._("publicDebateSelect"),
    value: "PUBLIC",
  });
  const [duo, setDuo] = React.useState(null);
  const [show, setShow] = React.useState(false);
  // const [duration, setDuration] = React.useState(
  //   new Date(moment().add(1, "days"))
  // ); // minutes
  const [duration, setDuration] = React.useState({
    hour: "00",
    day: "0",
  });
  const [content, setContent] = React.useState("");
  const [optionOne, setOptionOne] = React.useState("");
  const [optionTwo, setOptionTwo] = React.useState("");

  const { navigation, route } = props;
  if (show) return <InvitationDebate setShow={setShow} setDuo={setDuo} />;
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
          <View style={{ marginTop: 52 }}>
            <View
              style={{
                flexDirection: "row",
                marginLeft: 15,
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: currentUser.profilePicture }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 50,
                }}
              />
              <Text
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                  marginLeft: 10,
                  fontSize: 12,
                  color: themeSchema[theme].colorText,
                }}
              >
                {`${currentUser.firstname} ${currentUser.lastname}`}
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Select
                list={[
                  {
                    label: i18n._("publicDebateSelect"),
                    value: "PUBLIC",
                  },
                  {
                    label: i18n._("duoDebateSelect"),
                    value: "DUO",
                  },
                ]}
                selected={debateType}
                placeholder=""
                onSelect={(type) => setDebateType(type)}
                renderComponent={
                  <View
                    style={{
                      ...styles.inputSelect,
                      backgroundColor: themeSchema[theme].backgroundColor1,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat_500Medium",
                        color: themeSchema[theme].colorText,
                      }}
                    >
                      {debateType.label}
                    </Text>
                  </View>
                }
              />
            </View>
            {
              debateType.value === "DUO" && (
                <TouchableWithoutFeedback
                  onPress={() => {
                    setShow(true);
                  }}
                >
                  <View
                    style={{
                      ...styles.inputInvite,
                      backgroundColor: themeSchema[theme].backgroundColor1,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Montserrat_500Medium",
                        color: themeSchema[theme].colorText,
                      }}
                    >
                      {duo === null
                        ? i18n._("invitePeople")
                        : `${duo.firstname} ${duo.lastname}`}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              ) // Here to launch screen to invite new person for debate
            }
            <View style={{ marginTop: 0 }}>
              <View
                style={{
                  backgroundColor: themeSchema[theme].backgroundColor1,
                  padding: 12,
                  paddingLeft: 20,
                  paddingRight: 20,
                  width: "100%",
                  borderRadius: 10,
                  color: "#000",
                  marginBottom: 3,
                  height: 40,
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                    color: themeSchema[theme].colorText,
                    fontSize: 12,
                  }}
                >
                  {i18n._("debateDuration")}
                </Text>
                <TextInput
                  value={duration.day}
                  selection={{
                    start: duration.day.length,
                    end: duration.day.length,
                  }}
                  onBlur={() => {
                    if (duration.day.length === 0)
                      setDuration({
                        ...duration,
                        day: "0",
                      });
                  }}
                  onChangeText={(day) => {
                    if (duration.day.length !== 0) {
                      const inputNumber = day[day.length - 1];
                      if (
                        [
                          "0",
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ].indexOf(inputNumber) !== -1
                      )
                        setDuration({
                          ...duration,
                          day: inputNumber,
                        });
                    }
                  }}
                  style={{
                    backgroundColor: themeSchema[theme].backgroundColor2,
                    color: themeSchema[theme].colorText,
                    width: 20,
                    fontSize: 14,
                    padding: 5,
                    fontFamily: "Montserrat_600SemiBold",
                    height: 30,
                    marginTop: -7,
                    textAlign: "center",
                    marginLeft: "auto",
                    borderRadius: 5,
                  }}
                  // caretHidden
                  keyboardType="numeric"
                />
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                    marginLeft: 5,
                    fontSize: 12,
                    color: themeSchema[theme].colorText,
                  }}
                >
                  {i18n._("days")}
                </Text>
                <TextInput
                  value={duration.hour}
                  selection={{
                    start: duration.hour.length,
                    end: duration.hour.length,
                  }}
                  onChangeText={(hour) => {
                    if (hour.length < 3 && checkOnlyDigits(hour))
                      setDuration({
                        ...duration,
                        hour,
                      });
                    if (
                      hour.length === 3 &&
                      checkOnlyDigits(hour) &&
                      hour[0] === "0" &&
                      hour[1] === "0"
                    ) {
                      setDuration({
                        ...duration,
                        hour: hour[2],
                      });
                    } else if (
                      hour.length === 3 &&
                      checkOnlyDigits(hour) &&
                      hour[0] !== "0" &&
                      hour[1] === "0"
                    ) {
                      setDuration({
                        ...duration,
                        hour: hour[0] + hour[2],
                      });
                    }
                  }}
                  onBlur={() => {
                    if (duration.hour.length === 0)
                      setDuration({
                        ...duration,
                        hour: "00",
                      });
                    if (duration.hour.length === 1)
                      setDuration({
                        ...duration,
                        hour: "0" + duration.hour,
                      });
                    if (duration.hour.length === 2) {
                      if (
                        parseInt(duration.hour, 10) === 24 &&
                        parseInt(duration.day, 10) < 9
                      ) {
                        setDuration({
                          day: `${parseInt(duration.day, 10) + 1}`,
                          hour: "00",
                        });
                      } else if (parseInt(duration.hour, 10) > 23) {
                        setDuration({
                          ...duration,
                          hour: "23",
                        });
                      }
                    }
                  }}
                  style={{
                    backgroundColor: themeSchema[theme].backgroundColor2,
                    color: themeSchema[theme].colorText,
                    width: 30,
                    fontSize: 14,
                    // padding: 0,
                    fontFamily: "Montserrat_600SemiBold",
                    height: 30,
                    marginTop: -7,
                    textAlign: "center",
                    marginLeft: 5,
                    borderRadius: 5,
                  }}
                  keyboardType="numeric"
                  // caretHidden
                />
                <Text
                  style={{
                    fontFamily: "Montserrat_500Medium",
                    marginLeft: 5,
                    fontSize: 12,
                    color: themeSchema[theme].colorText,
                  }}
                >
                  {i18n._("hours")}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontFamily: "Montserrat_200ExtraLight",
                marginLeft: 5,
                fontSize: 10,
                marginBottom: 7,
                marginLeft: 10,
                color: themeSchema[theme].colorText,
              }}
            >
              {i18n._("debateLimitationDurationMessage")}
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: themeSchema[theme].hrLineColor,
                width: "90%",
                alignSelf: "center",
              }}
            />
            <View style={{ marginTop: 10 }}>
              <TextInput
                placeholder={i18n._("describeDebate")}
                value={content}
                onChangeText={(c) => setContent(c)}
                style={{
                  ...styles.input,
                  color: themeSchema[theme].colorText,
                  backgroundColor: themeSchema[theme].backgroundColor1,
                }}
                keyboardType="default"
                placeholderTextColor={themeSchema[theme].colorText}
                multiline
                textAlignVertical="top"
              />
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
                placeholder={
                  debateType.value === "PUBLIC"
                    ? `${i18n._("choice")} 1`
                    : i18n._("yourOpinion")
                }
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
              {debateType.value === "PUBLIC" && (
                <TextInput
                  placeholder={`${i18n._("choice")} 2`}
                  value={optionTwo}
                  onChangeText={(oTwo) => {
                    if (oTwo.length < 35)
                      setOptionTwo(oTwo.replace(/\r?\n|\r/g, ""));
                  }}
                  style={{
                    ...styles.optionTwo,
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
              )}
            </View>
          </View>
          <TouchableOpacity onPress={() => {}} style={styles.connectionButton}>
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
    // flex: 1,
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

export default CreateDebate;
