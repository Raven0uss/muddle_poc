import { shield, and, or, not } from "graphql-shield";
import { isAuthenticated } from "./rules";

export default shield(
  {
    Query: {
      // users: isAuthenticated,
    },
    Mutation: {
      // createConversation: isAuthenticated,
    },
  },
  { allowExternalErrors: true }
);
