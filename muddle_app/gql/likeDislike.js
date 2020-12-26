import { gql } from "@apollo/client";

const LIKE_COMMENT = (liked) => {
  return gql`
    mutation($comment: ID!, $userId: ID!) {
      likeComment(userId: $userId, commentId: $comment) {
        id
      }
    }
  `;
};

const DISLIKE_COMMENT = (liked) => {
  return gql`
    mutation($comment: ID!, $userId: ID!) {
      dislikeComment(userId: $userId, commentId: $comment) {
        id
      }
    }
  `;
};

export { LIKE_COMMENT, DISLIKE_COMMENT };
