import { GraphQLScalarType } from "graphql";

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
        return new Date(value); // value from the client
      },
      serialize(value) {
        return value.getTime(); // value sent to the client
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return parseInt(ast.value, 10); // ast value is always in string format
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
