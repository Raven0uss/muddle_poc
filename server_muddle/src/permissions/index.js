import { shield } from "graphql-shield";

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
