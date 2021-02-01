import { gql } from "@apollo/client";

const userFragment = gql`
  fragment UserFragment on User {
    id
    firstname
    lastname
    email
    birthdate
    role
    gender
    certified
    profilePicture
    crowned
    private
    debates {
      id
    }
    trophies {
      id
    }
    mailStatus
    followers {
      id
    }
    following {
      id
    }
    blocked {
      id
    }
    blocking {
      id
    }
    createdAt
  }
`;

const getUsers = (filters) => {
  if (filters === "email")
    return gql`
      query($first: Int!, $skip: Int!, $search: String) {
        users(
          where: { role: STANDARD, email_contains: $search }
          first: $first
          skip: $skip
        ) {
          ...UserFragment
        }
      }
      ${userFragment}
    `;
  if (filters === "firstname")
    return gql`
      query($first: Int!, $skip: Int!, $search: String) {
        users(
          where: { role: STANDARD, firstname_contains: $search }
          first: $first
          skip: $skip
        ) {
          ...UserFragment
        }
      }
      ${userFragment}
    `;
  if (filters === "lastname")
    return gql`
      query($first: Int!, $skip: Int!, $search: String) {
        users(
          where: { role: STANDARD, lastname_contains: $search }
          first: $first
          skip: $skip
        ) {
          ...UserFragment
        }
      }
      ${userFragment}
    `;
};

export default getUsers;
