import { gql } from "apollo-server";

export default gql`
  type Message {
      content: String!
      to: User!
      from: User!
      sendDate: Date
  }
`;
