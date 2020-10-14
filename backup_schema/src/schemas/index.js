import { gql } from "apollo-server";

import adSchema from "./adSchema";
import adTargetSchema from "./adTargetSchema";
import commentSchema from "./commentSchema";
import conversationSchema from "./conversationSchema";
import debateSchema from "./debateSchema";
import interactionSchema from "./interactionSchema";
import messageSchema from "./messageSchema";
// import notificationSchema from "./notificationSchema";
import reportSchema from "./reportSchema";
import trophySchema from "./trophySchema";
import userSchema from "./userSchema";

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

export default [
  linkSchema,
  adSchema,
  adTargetSchema,
  commentSchema,
  conversationSchema,
  debateSchema,
  interactionSchema,
  messageSchema,
  // notificationSchema,
  reportSchema,
  trophySchema,
  userSchema,
];
