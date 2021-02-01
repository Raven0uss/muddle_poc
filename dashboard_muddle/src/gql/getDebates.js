import { gql } from "@apollo/client";

const debateFragment = gql`
  fragment DebateFragment on Debate {
    id
    type
    content
    comments {
      id
      content
      from {
        id
        firstname
        lastname
        email
      }
      likes {
        id
      }
      dislikes {
        id
      }
      reports {
        id
        from {
          id
          firstname
          lastname
          email
        }
        to {
          id
          firstname
          lastname
          email
        }
        type
        reasonText
        comment {
          id
          content
          from {
            id
            firstname
            lastname
            email
          }
        }
        debate {
          id
          type
          content
          image
          owner {
            id
            firstname
            lastname
            email
          }
          ownerRed {
            id
            firstname
            lastname
            email
          }
          ownerBlue {
            id
            firstname
            lastname
            email
          }
          answerOne
          answerTwo
        }
        treated
      }
      createdAt
    }
    owner {
      id
      firstname
      lastname
      email
    }
    ownerBlue {
      id
      firstname
      lastname
      email
    }
    ownerRed {
      id
      firstname
      lastname
      email
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
    answerOne
    answerTwo
    crowned
    image
    reports(orderBy: createdAt_DESC) {
      id
      from {
        id
        firstname
        lastname
        email
      }
      type
      reason
      reasonText
      treated
      debate {
        id
        owner {
          id
          firstname
          lastname
          email
        }
        ownerRed {
          id
          firstname
          lastname
          email
        }
        ownerBlue {
          id
          firstname
          lastname
          email
        }
        content
        type
        closed
        answerOne
        answerTwo
        image
      }
      comment {
        id
        from {
          id
          firstname
          lastname
          email
        }
        content
      }
      createdAt
      updatedAt
    }
    createdAt
    closed
    published
    timelimit
    image
    crowned
  }
`;

const getDebates = (filters) => {
  if (filters === "content") {
    return gql`
      query($first: Int!, $skip: Int!, $search: String) {
        debates(
          orderBy: createdAt_DESC
          first: $first
          skip: $skip
          where: { content_contains: $search }
        ) {
          ...DebateFragment
        }
      }
      ${debateFragment}
    `;
  }
};

export default getDebates;
