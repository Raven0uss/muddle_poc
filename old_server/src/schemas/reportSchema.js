import { gql } from "apollo-server";

export default gql`
  enum ReportType {
      DEBATE
      COMMENT
  }

  enum ReportReason {
      INSULT
      RACISM
      SEXISM
      VIOLENCE
      PORNOGRAPHY
  }

  type Report {
    id: ID!
    from: User
    to: User
    type: ReportType!
    reason: ReportReason!
    reasonText: String
    debate: Debate
    comment: Comment
    treated: Boolean!
  }

  extend type Query {
    report(id: ID!): Report!
    reports: [Report]
  }
`;
