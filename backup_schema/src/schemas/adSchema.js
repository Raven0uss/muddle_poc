import { gql } from "apollo-server";

export default gql`
  type Ad {
    id: ID!
    content: String!
    targets: [AdTarget]
    active: Boolean!
    ratio: Int!
  }

  extend type Query {
    ad(id: ID!): Ad!
    ads: [Ad]
  }

  input CreateAdInput {
    content: String!
    targets: [CreateAdTargetInput]
    active: Boolean!
    ratio: Int!
  }

  input UpdateAdInput {
    id: ID!
    content: String
    targets: [UpdateAdTargetInput]
    active: Boolean
    ratio: Int!
  }

  type CreateAdPayload {
    ad: Ad!
  }

  type UpdateAdPayload {
    ad: Ad!
  }

  extend type Mutation {
    createAd(input: CreateAdInput!): CreateAdPayload!
    updateAd(input: UpdateAdInput): UpdateAdPayload!
  }
`;
