import { gql } from "apollo-server";

export default gql`
  enum Role {
    STANDARD
    MODERATOR
    ADMIN
    MUDDLE
  }

  enum Gender {
    MALE
    FEMALE
    NO_INDICATION
  }

  enum Language {
    FR
    EN
  }

  type User {
    id: ID!
    pseudo: String!
    mail: String!
    birthdate: Date!
    role: Role!
    certified: Boolean!
    gender: Gender!
    profilePicture: String
    coverPicture: String
    bio: String
    language: Language!
    crowned: Boolean!
    lastConnected: Date!
    followers: [User]
    following: [User]
    blocked: [User]
    debates: [Debate]
    trophies: [Trophy]
    conversations: [Conversation]
    interactions: [Interaction]
  }

  type Token {
    token: String!
  }

  extend type Query {
    user(id: ID!): User!
    users: [User]
    login(pseudo: String!, password: String!): Token!
  }

  extend type Mutation {
    createUser(pseudo: String!, password: String!, mail: String!): User!
  }
`;
