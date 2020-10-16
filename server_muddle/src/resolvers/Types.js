import { objectType, scalarType } from "nexus/dist";
import moment from "moment";

const DateScalar = scalarType({
  name: "DateTime",
  asNexusMethod: "date",
  description: "Date custom scalar type",

  parseValue(value) {
    return new Date(value);
  },

  serialize(value) {
    return value.getTime();
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

// const NotificationSubPayload = objectType({
//   name: "NotificationSubPayload",
//   definition(t) {
//     t.field("node", {
//       type: "Notification",
//       nullable: true,
//     });
//     t.list.string("updatedFields", { nullable: true });
//   },
// });

export default {
  Token,
  DateScalar,
  MessageSubPayload,
  // NotificationSubPayload,
  CommentSubPayload,
};
