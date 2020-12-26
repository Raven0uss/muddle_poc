import { gql } from "@apollo/client";

const SEND_POSITIVE_VOTE = gql`
  mutation($debate: ID!, $userId: ID!) {
    sendVote(debateId: $debate, userId: $userId, type: "positive") {
      id
    }
  }
`;

const SEND_NEGATIVE_VOTE = gql`
  mutation($debate: ID!, $userId: ID!) {
    sendVote(debateId: $debate, userId: $userId, type: "negative") {
      id
    }
  }
`;

const SEND_BLUE_VOTE = gql`
  mutation($debate: ID!, $userId: ID!) {
    sendVote(debateId: $debate, userId: $userId, type: "blue") {
      id
    }
  }
`;

const SEND_RED_VOTE = gql`
  mutation($debate: ID!, $userId: ID!) {
    sendVote(debateId: $debate, userId: $userId, type: "red") {
      id
    }
  }
`;

export {
  SEND_NEGATIVE_VOTE,
  SEND_POSITIVE_VOTE,
  SEND_RED_VOTE,
  SEND_BLUE_VOTE,
};
