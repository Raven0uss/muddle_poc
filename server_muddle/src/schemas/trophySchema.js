import { gql } from "apollo-server";

export default gql`
  enum TrophyType {
    DUO
    TOP_COMMENT
  }

  type Trophy {
    user: User!
    won: Boolean!
    type: TrophyType
    debate: Debate
    comment: Comment
  }
`;
