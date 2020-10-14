import { gql } from "apollo-server";

export default gql`
  enum InteractionType {
    LIKE
    DISLIKE
    COMMENT
    POSITIVE_VOTE
    NEGATIVE_VOTE
    BLUE_VOTE
    RED_VOTE
  }

  type Interaction {
    id: ID!
    type: InteractionType!
    who: User!
    debate: Debate
    comment: Comment
  }

  extend type Query {
    interaction(id: ID!): Interaction!
    interactions: [Interaction]
  }
`;
