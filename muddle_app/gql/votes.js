import { gql } from "@apollo/client";

const SEND_POSITIVE_VOTE = gql`
  mutation($debate: ID!, $userId: ID!) {
    updateDebate(
      where: { id: $debate }
      data: { positives: { connect: { id: $userId } } }
    ) {
      id
    }
  }
`;

const SEND_NEGATIVE_VOTE = gql`
  mutation($debate: ID!, $userId: ID!) {
    updateDebate(
      where: { id: $debate }
      data: { negatives: { connect: { id: $userId } } }
    ) {
      id
    }
  }
`;

const SEND_BLUE_VOTE = gql`
  mutation($debate: ID!, $userId: ID!) {
    updateDebate(
      where: { id: $debate }
      data: { blueVotes: { connect: { id: $userId } } }
    ) {
      id
    }
  }
`;

const SEND_RED_VOTE = gql`
  mutation($debate: ID!, $userId: ID!) {
    updateDebate(
      where: { id: $debate }
      data: { redVotes: { connect: { id: $userId } } }
    ) {
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
