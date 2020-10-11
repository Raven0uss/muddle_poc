import { gql } from "apollo-server";

export default gql`
  type Comment {
      from: String!
      content: String!
      likes: [User]
      dislikes: [User]
      reports: [Report]
      debate: Debate!
  }
`;
