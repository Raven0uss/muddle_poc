import { gql } from "apollo-server";

export default gql`
  type Conversation {
      speakers: [User!]!
      messages: [Message]
  }
`;
