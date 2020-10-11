import { gql } from "apollo-server";

export default gql`
  enum GenderFilter {
    MALE
    FEMALE
    ALL
  }

  type AdTarget {
    gender: GenderFilter!
    birthdateMin: Date!
    birthdateMax: Date!
  }
`;
