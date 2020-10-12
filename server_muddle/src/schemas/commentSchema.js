import { gql } from "apollo-server";

export default gql`
  type Comment {
    id: ID!
    from: String!
    content: String!
    likes: [User]
    dislikes: [User]
    reports: [Report]
    debate: Debate!
  }

  extend type Query {
    comment(id: ID!): Comment!
    comments: [Comment]
  }
`;
