import { Expo } from "expo-server-sdk";
import { isNil } from "lodash";

const expo = new Expo();

const sendPushNotification = ({
  pushToken,
  title,
  subtitle = null,
  body,
  sound = false,
  badge,
  data = {},
}) => {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }
  console.log("wesh");

  // https://docs.expo.io/push-notifications/sending-notifications/#message-request-format
  const messages = [
    {
      to: pushToken,
      title,
      body,
      sound: sound ? "default" : null,
      badge,
      data,
      ...(isNil(subtitle) ? {} : { subtitle }),
    },
  ];
  chunkAndSendMessages(messages);
  return;
};

const clearApplicationBadges = ({ pushToken }) => {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }
  const messages = [{ to: pushToken, badge: 0 }];
  chunkAndSendMessages(messages);
  return;
};

const chunkAndSendMessages = async (messages) => {
  const chunks = expo.chunkPushNotifications(messages);
  for (let chunk of chunks) {
    try {
      console.log(chunk);
      await expo.sendPushNotificationsAsync(chunk);
    } catch (err) {
      console.error(err);
    }
  }
  return;
};

export { sendPushNotification, clearApplicationBadges };
