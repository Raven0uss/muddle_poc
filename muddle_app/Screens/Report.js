import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import Header from "../Components/Header";
import { ScrollView } from "react-native-gesture-handler";
import CustomIcon from "../Components/Icon";
import { muddle, defaultProfile } from "../CustomProperties/IconsBase64";
import Select from "../Components/Select";
import i18n from "../i18n";
import { gql, useMutation } from "@apollo/client";
import UserContext from "../CustomProperties/UserContext";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";

const SEND_REPORT_DEBATE = gql`
  mutation(
    $from: ID!
    $reason: ReportReason!
    $reasonText: String
    $debateId: ID!
  ) {
    createReport(
      data: {
        from: { connect: { id: $from } }
        type: DEBATE
        reason: $reason
        reasonText: $reasonText
        debate: { connect: { id: $debateId } }
      }
    ) {
      id
    }
  }
`;

const SEND_REPORT_COMMENT = gql`
  mutation(
    $from: ID!
    $reason: ReportReason!
    $reasonText: String
    $commentId: ID!
  ) {
    createReport(
      data: {
        from: { connect: { id: $from } }
        type: COMMENT
        reason: $reason
        reasonText: $reasonText
        comment: { connect: { id: $commentId } }
      }
    ) {
      id
    }
  }
`;

const sendReport = async ({
  from,
  // to,
  type,
  reason,
  reasonText,
  content,
  reqSendReportDebate,
  reqSendReportComment,
}) => {
  if (type === "DEBATE") {
    // const debateOwner =
    await reqSendReportDebate({
      variables: {
        from,
        // to: debateOwner,
        reason,
        reasonText,
        debateId: content.id,
      },
    });
  } else if (type === "COMMENT")
    await reqSendReportComment({
      variables: {
        from,
        // to,
        reason,
        reasonText,
        commentId: content.id,
      },
    });
};

const Report = (props) => {
  const { currentUser } = React.useContext(UserContext);
  const { theme } = React.useContext(ThemeContext);
  const [form, setForm] = React.useState({
    reason: null,
    reasonText: "",
  });
  const { navigation, route } = props;
  const { type, content } = route.params;

  const [reqSendReportComment] = useMutation(SEND_REPORT_COMMENT, {
    onCompleted: () => {
      navigation.goBack();
    },
  });
  const [reqSendReportDebate] = useMutation(SEND_REPORT_DEBATE, {
    onCompleted: () => {
      navigation.goBack();
    },
  });

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
      <View
        style={{
          flex: 1,
          backgroundColor: themeSchema[theme].backgroundColor1,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          paddingLeft: 15,
          paddingRight: 15,
          //   alignItems: "center"
        }}
      >
        <KeyboardAvoidingView behavior="padding">
          <Text
            style={{
              marginTop: 30,
              marginBottom: 30,
              alignSelf: "center",
              fontFamily: "Montserrat_700Bold",
              color: themeSchema[theme].colorText,
            }}
          >
            {`${i18n._("reportA")} ${
              type === "DEBATE" ? i18n._("debate") : i18n._("comment")
            }`}
          </Text>
          <Select
            list={[
              {
                label: i18n._("reportInjury"),
                value: "INSULT",
              },
              {
                label: i18n._("reportRacism"),
                value: "RACISM",
              },
              {
                label: i18n._("reportSexism"),
                value: "SEXISM",
              },
              {
                label: i18n._("reportViolence"),
                value: "VIOLENCE",
              },
              {
                label: i18n._("reportPorn"),
                value: "PORNOGRAPHY",
              },
            ]}
            selected={form.reason}
            placeholder={i18n._("reportSelectReason")}
            onSelect={(reason) =>
              setForm({
                ...form,
                reason,
              })
            }
          />
          <TextInput
            returnKeyType={"done"}
            onKeyPress={(e) => {
              e.preventDefault();
              if (e.nativeEvent.key === "Enter") Keyboard.dismiss();
            }}
            placeholder={i18n._("reportGiveMoreReason")}
            value={form.reasonText}
            onChangeText={(reasonText) => {
              if (reasonText[reasonText.length - 1] !== "\n")
                setForm({
                  ...form,
                  reasonText,
                });
            }}
            style={{
              ...styles.input,
              backgroundColor: themeSchema[theme].backgroundColor2,
              color: themeSchema[theme].colorText,
            }}
            keyboardType="default"
            placeholderTextColor={themeSchema[theme].colorText}
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity
            onPress={() => {
              sendReport({
                from: currentUser.id,
                type,
                reason: form.reason.value,
                reasonText: form.reasonText,
                content,
                reqSendReportComment,
                reqSendReportDebate,
              });
            }}
            style={{
              alignSelf: "flex-end",
              backgroundColor: form.reason === null ? "#d3d3d3" : "#F47658",
              padding: 12,
              paddingLeft: 30,
              paddingRight: 30,
              borderRadius: 30,
              marginTop: 20,
            }}
            disabled={form.reason === null}
          >
            <Text
              style={{
                color: "#000",
                fontFamily: "Montserrat_700Bold",
              }}
            >
              {i18n._("report")}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F47658",
  },
  userPicture: {
    width: 40,
    height: 40,
    borderRadius: 30,
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
});

export default Report;
