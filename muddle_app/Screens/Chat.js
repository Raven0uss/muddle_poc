import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  Platform,
} from "react-native";
import Header from "../Components/Header";
import CustomIcon from "../Components/Icon";
import { muddle, defaultProfile } from "../CustomProperties/IconsBase64";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import UserContext from "../CustomProperties/UserContext";

const renderItem = ({ item }, navigation, me, theme) => {
  const paddingMessages = 15;
  if (item.from.id === me.id)
    return (
      <View
        style={{
          backgroundColor: "#F47658",
          padding: paddingMessages,
          paddingLeft: paddingMessages * 2,
          paddingRight: paddingMessages * 2,
          marginTop: 7,
          marginBottom: 7,
          maxWidth: Dimensions.get("screen").width / 1.5,
          alignSelf: "flex-end",
          borderRadius: 12,
          borderTopRightRadius: 0,
        }}
      >
        <Text
          style={{
            color: themeSchema[theme].colorText3,
            fontSize: 12,
            fontFamily: "Montserrat_500Medium",
          }}
        >
          {item.content}
        </Text>
        <Text
          style={{
            color: themeSchema[theme].colorText2,
            fontSize: 10,
            alignSelf: "flex-end",
            marginTop: 6,
            fontFamily: "Montserrat_500Medium",
          }}
        >
          10:26
        </Text>
      </View>
    );
  return (
    <View
      style={{
        backgroundColor: themeSchema[theme].backgroundColor1,
        padding: paddingMessages,
        paddingLeft: paddingMessages * 2,
        paddingRight: paddingMessages * 2,
        marginTop: 7,
        marginBottom: 7,
        maxWidth: Dimensions.get("screen").width / 1.5,
        alignSelf: "flex-start",
        borderRadius: 12,
        borderTopLeftRadius: 0,
      }}
    >
      <Text
        style={{
          color: themeSchema[theme].colorText,
          fontSize: 12,
          fontFamily: "Montserrat_500Medium",
        }}
      >
        {item.content}
      </Text>
      <Text
        style={{
          color: "#A3A3A3",
          fontSize: 10,
          alignSelf: "flex-end",
          marginTop: 6,
          fontFamily: "Montserrat_500Medium",
        }}
      >
        10:26
      </Text>
    </View>
  );
};

const Chat = (props) => {
  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);
  const [newMessage, setNewMessage] = React.useState("");
  const [keyboardIsOpen, setKeyboardIsOpen] = React.useState(false);
  // const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        // setKeyboardHeight(e.endCoordinates.height);
        setKeyboardIsOpen(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardIsOpen(false)
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const { navigation, route } = props;
  const { conversation } = route.params;

  // console.log(conversation);

  // DATA TEST
  const me = currentUser;
  const speaker = conversation.speakers.filter((u) => u.id !== currentUser.id);
  if (speaker === null) return null;
  const partner = speaker[0];

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
      {/* Header of flatlist with profile view */}
      <View
        style={{
          backgroundColor: themeSchema[theme].backgroundColor2,
          shadowColor: themeSchema[theme].colorText,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          alignItems: "center",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.push("Profile", {
              userId: partner.email,
            });
          }}
        >
          <View
            style={{
              backgroundColor: themeSchema[theme].backgroundColor1,
              height: 44,
              width: 185,
              marginTop: 33,
              marginBottom: 10,
              borderRadius: 12,
            }}
          >
            <Image
              source={{ uri: partner.profilePicture }}
              style={{
                width: 38,
                height: 38,
                position: "absolute",
                marginTop: -19,
                // borderWidth: 1,
                borderRadius: 50,
                alignSelf: "center",
              }}
            />
            <Text
              style={{
                marginTop: 25,
                alignSelf: "center",
                fontSize: 12,
                fontFamily: "Montserrat_500Medium",
                color: themeSchema[theme].colorText,
              }}
            >
              {`${partner.firstname} ${partner.lastname}`}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversation.messages}
        style={{
          backgroundColor: themeSchema[theme].backgroundColor2,
          paddingLeft: 15,
          paddingRight: 15,
        }}
        renderItem={(param) => renderItem(param, navigation, me, theme)}
        keyExtractor={(item) => item.id}
        inverted={true}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : ""}
        style={
          Platform.OS === "android" &&
          keyboardIsOpen && {
            bottom: 0,
            elevation: 10,
            position: "absolute",
          }
        }
      >
        <View
          style={{
            minHeight: 60,
            maxHeight: 200,
            width: "100%",
            backgroundColor: themeSchema[theme].backgroundColor2,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 10,
            flexDirection: "row",
          }}
        >
          <TextInput
            multiline
            placeholder={i18n._("yourMessage")}
            value={newMessage}
            style={{
              width:
                Dimensions.get("screen").width - 55 - (keyboardIsOpen ? 45 : 0),
              minHeight: 40,
              maxHeight: 60,
              borderRadius: 10,
              backgroundColor: themeSchema[theme].backgroundColor1,
              marginLeft: "auto",
              // marginRight: "auto",
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 20,
              paddingRight: 20,
              color: themeSchema[theme].colorText,
              // alignItems: "center",
              // marginBottom: 14,
              marginTop: 10,
              // marginBottom: 20,
              fontFamily: "Montserrat_500Medium",
            }}
            keyboardType="default"
            onChangeText={(nm) => setNewMessage(nm)}
            placeholderTextColor={themeSchema[theme].colorText}
            keyboardAppearance={theme}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: 45 + (keyboardIsOpen ? 45 : 0),
              marginTop: 10,
            }}
          >
            {keyboardIsOpen && (
              <TouchableOpacity onPress={() => Keyboard.dismiss()}>
                <CustomIcon
                  name="keyboard-hide"
                  size={26}
                  color={themeSchema[theme].colorText}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
              <CustomIcon
                name="send"
                size={26}
                color={themeSchema[theme].colorText}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F47658",
  },
});

export default Chat;
