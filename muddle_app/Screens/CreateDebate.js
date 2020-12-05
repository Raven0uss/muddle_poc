import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import Header from "../Components/Header";
import { withTheme } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import Select from "../Components/Select";
import DatePicker from "../Components/DatePicker";
import { defaultProfile, muddle } from "../CustomProperties/IconsBase64";
import moment from "moment";

const CreateDebate = (props) => {
  const [debateType, setDebateType] = React.useState({
    label: "Debat public",
    value: "PUBLIC",
  });
  const [duo, setDuo] = React.useState(null);
  const [duration, setDuration] = React.useState(
    new Date(moment().add(1, "days"))
  ); // minutes
  const [content, setContent] = React.useState("");
  const [optionOne, setOptionOne] = React.useState("");
  const [optionTwo, setOptionTwo] = React.useState("");

  const { navigation, route } = props;
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
      <KeyboardAvoidingView behavior="padding" style={styles.seedContainer}>
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
                source={{ uri: defaultProfile }}
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
                }}
              >
                Sid-Ahmed Fahem
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Select
                list={[
                  {
                    label: "Debat publique",
                    value: "PUBLIC",
                  },
                  {
                    label: "Debat en duo",
                    value: "DUO",
                  },
                ]}
                selected={debateType}
                placeholder=""
                onSelect={(type) => setDebateType(type)}
              />
            </View>
            {
              debateType.value === "DUO" && (
                <TouchableWithoutFeedback
                  onPress={() => {
                    // setShow((bool) => !bool);
                  }}
                >
                  <View style={styles.inputInvite}>
                    <Text
                      style={{
                        fontFamily: "Montserrat_500Medium",
                      }}
                    >
                      Inviter une personne
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              ) // Here to launch screen to invite new person for debate
            }
            <View style={{ marginTop: 0 }}>
              <DatePicker
                placeholder="Duree du debat"
                date={duration}
                onDateChange={(newDate) => {
                  setDuration(newDate);
                }}
              />
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "#DBDBDB",
                width: "90%",
                alignSelf: "center",
              }}
            />
            <View style={{ marginTop: 10 }}>
              <TextInput
                placeholder="Decrivez votre debat"
                value={content}
                onChangeText={(c) => setContent(c)}
                style={styles.input}
                keyboardType="default"
                placeholderTextColor="#222"
                multiline
                textAlignVertical="top"
              />
            </View>
            <View
              style={{
                marginTop: 10,
                borderRadius: 20,
                backgroundColor: "#fff",
                height: 100,
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <TextInput
                placeholder={
                  debateType.value === "PUBLIC"
                    ? "Choix numero 1"
                    : "Votre opinion"
                }
                value={optionOne}
                onChangeText={(oOne) => {
                  if (oOne.length < 35)
                    setOptionOne(oOne.replace(/\r?\n|\r/g, ""));
                }}
                style={styles.optionOne}
                keyboardType="default"
                // placeholderTextColor="#222"
                numberOfLines={3}
                multiline={true}
                scrollEnabled={false}
              />
              {debateType.value === "PUBLIC" && (
                <TextInput
                  placeholder="Choix numero 2"
                  value={optionTwo}
                  onChangeText={(oTwo) => {
                    if (oTwo.length < 35)
                      setOptionTwo(oTwo.replace(/\r?\n|\r/g, ""));
                  }}
                  style={styles.optionTwo}
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
              Publier
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
    backgroundColor: "#F7F7F7",
    paddingLeft: 15,
    paddingRight: 15,
    height: Dimensions.get("screen").height,
    // flex: 1,
  },
  input: {
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
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
    fontSize: 12,
    textAlign: "center",
  },
  optionTwo: {
    backgroundColor: "#fff",
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
    fontSize: 12,
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
    backgroundColor: "#fff",
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

export default withTheme(CreateDebate);
