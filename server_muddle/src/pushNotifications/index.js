import { Expo } from "expo-server-sdk";
import { isNil } from "lodash";

const expo = new Expo();

const sendPushNotification = ({
  pushToken,
  title,
  subtitle = null,
  body,
  sound = false,
  badge = 1,
  data = {},
}) => {
  let tokenList = pushToken.filter((pT) => {
    if (!Expo.isExpoPushToken(pT)) {
      console.error(`Push token ${pT} is not a valid Expo push token`);
      return false;
    }
    return true;
  });

  // https://docs.expo.io/push-notifications/sending-notifications/#message-request-format
  const messages = tokenList.map((token) => ({
    to: token,
    title,
    body,
    sound: sound ? "default" : null,
    badge,
    data,
    ...(isNil(subtitle) ? {} : { subtitle }),
  }));
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
      const response = await expo.sendPushNotificationsAsync(chunk);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }
  return;
};

export { sendPushNotification, clearApplicationBadges };
