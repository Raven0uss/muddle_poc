import { gql } from "@apollo/client";

const LIKE_COMMENT = (liked) => {
  if (liked === null)
    return gql`
      mutation($comment: ID!, $userId: ID!) {
        updateComment(
          where: { id: $comment }
          data: { likes: { connect: { id: $userId } } }
        ) {
          id
        }
      }
    `;
  if (liked === "dislike")
    return gql`
      mutation($comment: ID!, $userId: ID!) {
        updateComment(
          where: { id: $comment }
          data: {
            likes: { connect: { id: $userId } }
            dislikes: { disconnect: { id: $userId } }
          }
        ) {
          id
        }
      }
    `;
  return gql`
    mutation($comment: ID!, $userId: ID!) {
      updateComment(
        where: { id: $comment }
        data: { likes: { disconnect: { id: $userId } } }
      ) {
        id
      }
    }
  `;
};

const DISLIKE_COMMENT = (liked) => {
  if (liked === null)
    return gql`
      mutation($comment: ID!, $userId: ID!) {
        updateComment(
          where: { id: $comment }
          data: { dislikes: { connect: { id: $userId } } }
        ) {
          id
        }
      }
    `;
  if (liked === "like")
    return gql`
      mutation($comment: ID!, $userId: ID!) {
        updateComment(
          where: { id: $comment }
          data: {
            dislikes: { connect: { id: $userId } }
            likes: { disconnect: { id: $userId } }
          }
        ) {
          id
        }
      }
    `;
  return gql`
    mutation($comment: ID!, $userId: ID!) {
      updateComment(
        where: { id: $comment }
        data: { dislikes: { disconnect: { id: $userId } } }
      ) {
        id
      }
    }
  `;
};

export { LIKE_COMMENT, DISLIKE_COMMENT };
