import { gql } from "apollo-server";

export default gql`
  enum TrophyType {
    DUO
    TOP_COMMENT
  }

  type Trophy {
    id: ID!
    user: User!
    won: Boolean!
    type: TrophyType
    debate: Debate
    comment: Comment
  }

  extend type Query {
    trophy(id: ID!): Trophy!
    trophies: [Trophy]
  }
`;
