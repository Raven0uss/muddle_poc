import { gql } from "apollo-server";

export default gql`
  scalar Date

  enum DebateType {
    STANDARD
    DUO
  }

  type Debate {
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
`;
