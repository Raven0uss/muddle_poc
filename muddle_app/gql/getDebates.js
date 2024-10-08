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
          crowned
          owner {
            id
            firstname
            lastname
            email
            profilePicture
            certified
            private
            followers {
              id
            }
          }
          ownerBlue {
            id
            firstname
            lastname
            email
            profilePicture
            certified
            private
            followers {
              id
            }
          }
          ownerRed {
            id
            firstname
            lastname
            email
            profilePicture
            certified
            private
            followers {
              id
            }
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
  if (debateType === "CROWNED_DEBATES")
    return gql`
      query($first: Int!, $skip: Int) {
        debates(
          first: $first
          skip: $skip
          where: { published: true, crowned: true }
          orderBy: updatedAt_DESC
        ) {
          id
          content
          answerOne
          answerTwo
          image
          type
          crowned
          owner {
            id
            firstname
            lastname
            email
            profilePicture
            certified
            private
            followers {
              id
            }
          }
          ownerBlue {
            id
            firstname
            lastname
            email
            profilePicture
            certified
            private
            followers {
              id
            }
          }
          ownerRed {
            id
            firstname
            lastname
            email
            profilePicture
            certified
            private
            followers {
              id
            }
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
          crowned
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
            certified
            private
            followers {
              id
            }
          }
          ownerBlue {
            id
            firstname
            lastname
            email
            profilePicture
            certified
            private
            followers {
              id
            }
          }
          ownerRed {
            id
            firstname
            lastname
            email
            profilePicture
            certified
            private
            followers {
              id
            }
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
          crowned
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
            certified
            private
            followers {
              id
            }
          }
          ownerBlue {
            id
            firstname
            lastname
            email
            profilePicture
            certified
            private
            followers {
              id
            }
          }
          ownerRed {
            id
            firstname
            lastname
            email
            profilePicture
            certified
            private
            followers {
              id
            }
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
  if (debateType === "OWNER_DEBATES") {
    return gql`
      query($first: Int!, $skip: Int, $userId: ID!) {
        ownerDebates(first: $first, skip: $skip, userId: $userId) {
          id
          content
          crowned
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
            certified
            private
            followers {
              id
            }
          }
          ownerBlue {
            id
            firstname
            lastname
            email
            profilePicture
            certified
            private
            followers {
              id
            }
          }
          ownerRed {
            id
            firstname
            lastname
            email
            profilePicture
            certified
            private
            followers {
              id
            }
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
  }
};

export default GET_DEBATES;
