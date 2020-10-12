import { gql } from "apollo-server";

export default gql`
  type Message {
    id: ID!
    content: String!
    to: User!
    from: User!
    sendDate: Date
  }

  extend type Query {
    message(id: ID!): Message!
    messages: [Message]
  }
`;
