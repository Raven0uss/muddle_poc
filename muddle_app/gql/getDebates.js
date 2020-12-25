import { useQuery, gql } from "@apollo/client";

// FOR FILTERED DEBATES SCREEN

const GET_DEBATES = (debateType) => {
  if (debateType === "DUO" || debateType === "MUDDLE")
    return gql`
      query($first: Int!, $skip: Int, $filter: DebateType) {
        debates(
          first: $first
          skip: $skip
          where: { type: $filter, published: true }
          orderBy: updatedAt_DESC
        ) {
          id
          content
          answerOne
          answerTwo
          image
          type
          owner {
            id
            firstname
            lastname
            email
            profilePicture
          }
          ownerBlue {
            id
            firstname
            lastname
            email
            profilePicture
          }
          ownerRed {
            id
            firstname
            lastname
            email
            profilePicture
          }
          positives {
            id
          }
          negatives {
            id
          }
          redVotes {
            id
          }
          blueVotes {
            id
          }
          comments {
            id
          }
          closed
        }
      }
    `;
  if (debateType === "BEST_DEBATES")
    return gql`
      query($first: Int!, $skip: Int) {
        bestDebates(first: $first, skip: $skip) {
          id
          content
          answerOne
          answerTwo
          image
          type
          owner {
            id
            firstname
            lastname
            email
            profilePicture
          }
          ownerBlue {
            id
            firstname
            lastname
            email
            profilePicture
          }
          ownerRed {
            id
            firstname
            lastname
            email
            profilePicture
          }
          positives {
            id
          }
          negatives {
            id
          }
          redVotes {
            id
          }
          blueVotes {
            id
          }
          comments {
            id
          }
          closed
        }
      }
    `;
  if (debateType === "MY_DEBATES")
    return gql`
      query($first: Int!, $skip: Int) {
        myDebates(first: $first, skip: $skip) {
          id
          content
          answerOne
          answerTwo
          image
          type
          owner {
            id
            firstname
            lastname
            email
            profilePicture
          }
          ownerBlue {
            id
            firstname
            lastname
            email
            profilePicture
          }
          ownerRed {
            id
            firstname
            lastname
            email
            profilePicture
          }
          positives {
            id
          }
          negatives {
            id
          }
          redVotes {
            id
          }
          blueVotes {
            id
          }
          comments {
            id
          }
          closed
        }
      }
    `;
};

export default GET_DEBATES;
