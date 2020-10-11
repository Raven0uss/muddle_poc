import { GraphQLScalarType } from "graphql";
import dayjs from "dayjs";

import adResolver from "./adResolver";
import adTargetResolver from "./adTargetResolver";
import commentResolver from "./commentResolver";
import conversationResolver from "./conversationResolver";
import debateResolver from "./debateResolver";
import interactionResolver from "./interactionResolver";
import messageResolver from "./messageResolver";
import notificationResolver from "./notificationResolver";
import reportResolver from "./reportResolver";
import trophyResolver from "./trophyResolver";
import userResolver from "./userResolver";

export default [
  {
    Date: new GraphQLScalarType({
      name: "Date",
      description: "Date custom scalar type",
      parseValue(value) {
        return new Date(value); // Value from the client
      },
      serialize(value) {
        return value.getTime(); // Value sent to the client
      },
      parseLiteral(ast) {
        console.log(ast);
        if (ast.kind === "IntValue") {
          return parseInt(ast.value, 10);
        }
        if (ast.kind === "StringValue") {
          return dayjs(ast.value);
        }
        return null;
      },
    }),
  },
  adResolver,
  adTargetResolver,
  commentResolver,
  conversationResolver,
  debateResolver,
  interactionResolver,
  messageResolver,
  notificationResolver,
  reportResolver,
  trophyResolver,
  userResolver,
];
