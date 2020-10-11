import { gql } from "apollo-server";

export default gql`
  type Ad {
    content: String!
    targets: [AdTarget]
    active: Boolean!
    ratio: Int!
  }
`;
