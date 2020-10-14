import { gql } from "apollo-server";

export default gql`
  type Conversation {
    id: ID!
    speakers: [User!]!
    messages: [Message]
  }

  extend type Query {
    conversation(id: ID!): Conversation!
    conversations: [Conversation]
  }
`;
