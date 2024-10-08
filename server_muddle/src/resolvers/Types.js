import { objectType, scalarType, arg } from "nexus/dist";

import moment from "moment";

const dateArg = (options) => arg({ type: "DateTime", ...options });

const DateScalar = scalarType({
  name: "DateTime",
  asNexusMethod: "date",
  description: "Date custom scalar type",

  parseValue(value) {
    return new Date(value);
  },

  serialize(value) {
    return value;
  },

  parseLiteral(ast) {
    if (ast.kind === "IntValue") return new Date(ast.value);
    if (ast.kind === "StringValue") return moment(ast.value);

    return null;
  },
});

const Token = objectType({
  name: "Token",
  definition(t) {
    t.string("token");
  },
});

// const Gender = enumType({
//   name: "Gender",
//   members: ["FEMALE", "MALE", "NO_INDICATION"],
// });

const NoValue = objectType({
  name: "NoValue",
  definition(t) {
    t.int("value");
  },
});

const MainStats = objectType({
  name: "MainStats",
  definition(t) {
    t.int("debates");
    t.int("comments");
    t.int("malePercentage");
    t.int("femalePercentage");
    t.int("notDefinedPercentage");
    t.int("ageAverage");
    t.int("connectedToday");
  },
});

const AccountStats = objectType({
  name: "AccountStats",
  definition(t) {
    t.int("accounts");
    t.int("certified");
    t.int("crowns");
  },
});

// const ImageURI = objectType({
//   name: "ImageURI",
//   definition(t) {
//     t.string("image");
//   },
// });

const NewNotifications = objectType({
  name: "NewNotifications",
  definition(t) {
    t.int("messages");
    t.int("notifications");
  },
});

const MessageSubPayload = objectType({
  name: "MessageSubPayload",
  definition(t) {
    t.field("node", {
      type: "Message",
      nullable: true,
    });
    t.list.string("updatedFields", { nullable: true });
  },
});

const CommentSubPayload = objectType({
  name: "CommentSubPayload",
  definition(t) {
    t.field("node", {
      type: "Comment",
      nullable: true,
    });
    t.list.string("updatedFields", { nullable: true });
  },
});

const NotificationSubPayload = objectType({
  name: "NotificationSubPayload",
  definition(t) {
    t.field("node", {
      type: "Notification",
      nullable: true,
    });
    t.list.string("updatedFields", { nullable: true });
  },
});

const ConversationSubPayload = objectType({
  name: "ConversationSubPayload",
  definition(t) {
    t.field("node", {
      type: "Conversation",
      nullable: true,
    });
    t.list.string("updatedFields", { nullable: true });
  },
});

export { dateArg };

export default {
  Token,
  NoValue,
  MainStats,
  AccountStats,
  // ImageURI,
  NewNotifications,
  DateScalar,
  MessageSubPayload,
  NotificationSubPayload,
  CommentSubPayload,
  ConversationSubPayload,
};
