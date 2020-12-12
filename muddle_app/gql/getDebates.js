import { useQuery, gql } from "@apollo/client";

// FOR FILTERED DEBATES SCREEN

const GET_DEBATES = (debateType) => {
  if (debateType === "DUO" || debateType === "MUDDLE")
    return gql`
      query($first: Int!, $skip: Int, $filter: DebateType) {
        debates(first: $first, skip: $skip, where: { type: $filter }) {
          id
          content
          answerOne
          answerTwo
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
            nested
            comments {
              id
            }
            from {
              firstname
              lastname
              email
              profilePicture
            }
            content
            likes {
              id
            }
            dislikes {
              id
            }
          }
        }
      }
    `;
  if (debateType === "BEST_DEBATES")
    return gql`
      query($first: Int!, $skip: Int) {
        debates(first: $first, skip: $skip) {
          id
          content
          answerOne
          answerTwo
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
            nested
            comments {
              id
            }
            from {
              firstname
              lastname
              email
              profilePicture
            }
            content
            likes {
              id
            }
            dislikes {
              id
            }
          }
        }
      }
    `;
  if (debateType === "MY_DEBATES")
    return gql`
      query($first: Int!, $skip: Int, $user: String) {
        debates(
          first: $first
          skip: $skip
          where: { owner: { email: $user } }
        ) {
          id
          content
          answerOne
          answerTwo
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
            nested
            comments {
              id
            }
            from {
              firstname
              lastname
              email
              profilePicture
            }
            content
            likes {
              id
            }
            dislikes {
              id
            }
          }
        }
      }
    `;
};

export default GET_DEBATES;
