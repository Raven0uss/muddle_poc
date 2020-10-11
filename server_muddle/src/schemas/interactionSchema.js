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
    type: InteractionType!
    who: User!
    debate: Debate
    comment: Comment
  }
`;
