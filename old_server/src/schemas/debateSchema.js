import { gql } from "apollo-server";

export default gql`
  enum DebateType {
    STANDARD
    DUO
  }

  type Debate {
    id: ID!
    owner: User
    ownerBlue: User
    ownerRed: User
    content: String!
    timelimit: Date
    type: DebateType!
    comments: [Comment]
    topComment: Comment
    reports: [Report]
    positives: [User]
    negatives: [User]
    redVotes: [User]
    blueVotes: [User]
    winner: User
    loser: User
    closed: Boolean!
    crowned: Boolean!
    interactions: [Interaction]
  }

  extend type Query {
    debate(id: ID!): Debate!
    debates: [Debate]
  }
`;
