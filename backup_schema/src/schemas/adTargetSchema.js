import { gql } from "apollo-server";

export default gql`
  enum GenderFilter {
    MALE
    FEMALE
    ALL
  }

  type AdTarget {
    id: ID!
    gender: GenderFilter!
    birthdateMin: Date!
    birthdateMax: Date!
  }

  extend type Query {
    adTarget(id: ID!): AdTarget!
    adTargets: [AdTarget]
  }

  input CreateAdTargetInput {
    gender: GenderFilter!
    birthdateMin: Date!
    birthdateMax: Date!
  }

  input UpdateAdTargetInput {
    id: ID!
    gender: GenderFilter
    birthdateMin: Date
    birthdateMax: Date
  }

  type CreateAdTargetPayload {
    adTarget: AdTarget!
  }

  type UpdateAdTargetPayload {
    adTarget: AdTarget!
  }

  extend type Mutation {
    createAdTarget(input: CreateAdTargetInput!): CreateAdTargetPayload!
    updateAdTarget(input: UpdateAdTargetInput!): UpdateAdTargetPayload!
  }
`;
