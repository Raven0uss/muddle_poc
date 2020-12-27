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
  ActivityIndicator,
} from "react-native";
import Header from "../Components/Header";
import CustomIcon from "../Components/Icon";
import { muddle, defaultProfile } from "../CustomProperties/IconsBase64";
import i18n from "../i18n";
import ThemeContext from "../CustomProperties/ThemeContext";
import themeSchema from "../CustomProperties/Theme";
import UserContext from "../CustomProperties/UserContext";
import { useQuery, gql, useMutation, useSubscription } from "@apollo/client";
import { differenceWith, get, isEmpty } from "lodash";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import CertifiedIcon from "../Components/CertifiedIcon";
import getDateMessage from "../Library/getDateMessage";
import { isBlocked, isBlockingMe } from "../Library/isBlock";
import { cloneDeep } from "@apollo/client/utilities";

const renderItem = (
  { item },
  navigation,
  me,
  theme,
  selectedList,
  setSelectedList,
  deleteMode,
  setDeleteMode
) => {
  const isSelected = selectedList.findIndex((s) => s.id === item.id) !== -1;
  const paddingMessages = 15;
  if (item.from.id === me.id)
    return (
      <TouchableOpacity
        onPress={() => {
          if (deleteMode) {
            if (!isSelected)
              setSelectedList((s) => [...s, { id: item.id, deleted: item.deleted }]);
            else
              setSelectedList((s) => {
                const sCpy = cloneDeep(s);
                const sIndex = sCpy.findIndex((s) => s.id === item.id);
                if (sIndex === -1) return s;
                sCpy.splice(sIndex, 1);
                return sCpy;
              });
          }
        }}
        onLongPress={() => {
          setDeleteMode(true);
          setSelectedList((s) => [...s, { id: item.id, deleted: item.deleted }]);
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View
            style={{
              backgroundColor: "#F47658",
              padding: paddingMessages,
              paddingLeft: paddingMessages * 2,
              paddingRight: paddingMessages * 2,
              marginTop: 7,
              marginBottom: 7,
              maxWidth: Dimensions.get("screen").width / 1.5,
              marginLeft: "auto",
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
                marginLeft: "auto",
                marginTop: 6,
                fontFamily: "Montserrat_500Medium",
              }}
            >
              {getDateMessage(item.createdAt)}
            </Text>
          </View>
          {/* Selection */}
          {deleteMode && (
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 50,
                borderColor: themeSchema[theme].colorText,
                borderWidth: 1,
                marginLeft: 5,
                backgroundColor: "#FFFFFF",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  height: 16,
                  width: 16,
                  borderRadius: 50,
                  borderColor: themeSchema[theme].colorText,
                  backgroundColor: isSelected ? "#F47658" : "#FFFFFF",
                  marginTop: "auto",
                  marginLeft: "auto",
                  marginBottom: "auto",
                  marginRight: "auto",
                }}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  return (
    <TouchableOpacity
      onPress={() => {
        if (deleteMode) {
          if (!isSelected)
            setSelectedList((s) => [...s, { id: item.id, deleted: item.deleted }]);
          else
            setSelectedList((s) => {
              const sCpy = cloneDeep(s);
              const sIndex = sCpy.findIndex((s) => s.id === item.id);
              if (sIndex === -1) return s;
              sCpy.splice(sIndex, 1);
              return sCpy;
            });
        }
      }}
      onLongPress={() => {
        setDeleteMode(true);
        setSelectedList((s) => [...s, { id: item.id, deleted: item.deleted }]);
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {/* Selection */}
        {deleteMode && (
          <View
            style={{
              height: 20,
              width: 20,
              borderRadius: 50,
              borderColor: themeSchema[theme].colorText,
              borderWidth: 1,
              marginRight: 5,
              backgroundColor: "#FFFFFF",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                height: 16,
                width: 16,
                borderRadius: 50,
                borderColor: themeSchema[theme].colorText,
                backgroundColor: isSelected ? "#F47658" : "#FFFFFF",
                marginTop: "auto",
                marginLeft: "auto",
                marginBottom: "auto",
                marginRight: "auto",
              }}
            />
          </View>
        )}
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
            {getDateMessage(item.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SEND_MESSAGE = gql`
  mutation($content: String!, $to: ID!, $from: ID!, $conversation: ID!) {
    createMessage(
      data: {
        content: $content
        to: { connect: { id: $to } }
        from: { connect: { id: $from } }
        conversation: { connect: { id: $conversation } }
        read: false
      }
    ) {
      id
    }
  }
`;

const MESSAGES_CHAT_SUB = gql`
  subscription($userId: String!, $conversationId: String!) {
    message(userId: $userId, conversationId: $conversationId) {
      node {
        id
        content
        from {
          id
        }
        to {
          id
        }
        deleted
        createdAt
      }
    }
  }
`;

const GET_MESSAGES = gql`
  query($conversationId: ID!, $last: Int!, $skip: Int, $userId: String!) {
    messages(
      last: $last
      skip: $skip
      orderBy: createdAt_DESC
      where: { conversation: { id: $conversationId }, deleted_not: $userId }
    ) {
      id
      content
      deleted
      from {
        id
      }
      to {
        id
      }
      createdAt
    }
  }
`;

const MESSAGES_UDPATE_VIEW = gql`
  mutation($conversationId: ID!, $userId: ID!) {
    updateManyMessages(
      where: { conversation: { id: $conversationId }, to: { id: $userId } }
      data: { read: true }
    ) {
      count
    }
  }
`;

const LAST_MESSAGE_READ = gql`
  mutation($messageId: ID!) {
    updateMessage(where: { id: $messageId }, data: { read: true }) {
      id
    }
  }
`;

const DELETE_MESSAGES = gql`
  mutation($messagesIdPayload: String!) {
    deleteMessages(messagesIdPayload: $messagesIdPayload) {
      value
    }
  }
`;

const frequency = 50;
let nbMessages = frequency;

const Chat = (props) => {
  const { navigation, route } = props;
  const { conversation } = route.params;

  const { theme } = React.useContext(ThemeContext);
  const { currentUser } = React.useContext(UserContext);
  const [newMessage, setNewMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [selectedList, setSelectedList] = React.useState([]);
  const [deleteMode, setDeleteMode] = React.useState(false);
  const [noMoreData, setNoMoreData] = React.useState(false);
  const [keyboardIsOpen, setKeyboardIsOpen] = React.useState(false);
  // const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  const me = currentUser;
  const speaker = conversation.speakers.filter((u) => u.id !== currentUser.id);
  const partner = speaker[0];

  const { loading, error, fetchMore } = useQuery(GET_MESSAGES, {
    variables: {
      last: nbMessages,
      conversationId: conversation.id,
      userId: currentUser.id,
    },
    onCompleted: (response) => {
      const { messages: queryResult } = response;
      setMessages(queryResult);
      if (queryResult.length === 0) setNoMoreData(true);
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    variables: {
      to: partner.id,
      from: me.id,
      content: newMessage,
      conversation: conversation.id,
    },
    onCompleted: (response) => {
      console.log(response);
    },
  });

  const [lastMessageRead] = useMutation(LAST_MESSAGE_READ);
  const [markAsReadMessages] = useMutation(MESSAGES_UDPATE_VIEW, {
    variables: {
      conversationId: conversation.id,
      userId: currentUser.id,
    },
  });

  const [deleteMessages] = useMutation(DELETE_MESSAGES);

  useSubscription(MESSAGES_CHAT_SUB, {
    variables: {
      userId: currentUser.id,
      conversationId: conversation.id,
    },
    shouldResubscribe: true,
    onSubscriptionData: (response) => {
      const { subscriptionData } = response;
      const payload = get(subscriptionData, "data.message.node");
      if (payload === undefined) return;
      if (get(payload, "id") === undefined) return;
      setMessages((m) => [payload, ...m]);
      if (payload.to.id === currentUser.id) {
        lastMessageRead({
          variables: {
            messageId: payload.id,
          },
        });
      }
    },
  });

  const isFocused = useIsFocused();
  React.useEffect(() => {
    markAsReadMessages();
  }, [isFocused]);

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

  // console.log(conversation);

  // DATA TEST

  return (
    <View style={styles.container}>
      <Header
        LeftComponent={
          <TouchableOpacity
            onPress={() => {
              if (deleteMode) {
                setDeleteMode(false);
                setSelectedList([]);
              } else navigation.goBack();
            }}
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
              marginLeft: deleteMode ? 0 : -36,
              marginBottom: 10,
            }}
          />
        }
        RightComponent={
          deleteMode ? (
            <TouchableOpacity
              onPress={() => {
                if (deleteMode) {
                  setDeleteMode(false);
                  if (isEmpty(selectedList)) return;
                  setMessages((m) => {
                    return differenceWith(
                      m,
                      selectedList,
                      (a, b) => a.id === b.id
                    );
                  });
                  deleteMessages({
                    variables: {
                      messagesIdPayload: JSON.stringify({
                        messagesId: selectedList,
                      }),
                    },
                  });
                  setSelectedList([]); // just for the moment
                }
              }}
              style={{ marginTop: 5 }}
            >
              <CustomIcon name={"delete"} size={36} />
            </TouchableOpacity>
          ) : null
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
              {partner.certified && <CertifiedIcon />}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        style={{
          backgroundColor: themeSchema[theme].backgroundColor2,
          paddingLeft: 15,
          paddingRight: 15,
        }}
        renderItem={(param) =>
          renderItem(
            param,
            navigation,
            me,
            theme,
            selectedList,
            setSelectedList,
            deleteMode,
            setDeleteMode
          )
        }
        keyExtractor={(item) => item.id}
        inverted={true}
        onEndReachedThreshold={0.5}
        onEndReached={async () => {
          if (Platform.OS === "web" || noMoreData) return;
          // return ;
          nbMessages += frequency;
          await fetchMore({
            variables: {
              last: frequency,
              skip: nbMessages - frequency,
              conversationId: conversation.id,
              userId: currentUser.id,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const { messages: moreMessages } = fetchMoreResult;
              if (isEmpty(moreMessages)) {
                setNoMoreData(true);
                return;
              }
              setMessages((previousState) =>
                [...previousState, ...moreMessages].reduce((acc, current) => {
                  const x = acc.find((item) => item.id === current.id);
                  if (!x) {
                    return acc.concat([current]);
                  } else {
                    return acc;
                  }
                }, [])
              );
            },
          });
        }}
        ListFooterComponent={() => {
          if (noMoreData) return <View style={{ height: 50, width: 10 }} />;
          return <ActivityIndicator style={{ marginBottom: 70 }} />;
        }}
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
            editable={
              isBlockingMe({ currentUser, userId: partner.id }) === false &&
              isBlocked({ currentUser, userId: partner.id }) === false
            }
            multiline
            placeholder={
              isBlockingMe({ currentUser, userId: partner.id }) === false &&
              isBlocked({ currentUser, userId: partner.id }) === false
                ? i18n._("yourMessage")
                : i18n._("youCantContact")
            }
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
            <TouchableOpacity
              onPress={async () => {
                Keyboard.dismiss();
                setNewMessage("");
                await sendMessage();
              }}
            >
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
