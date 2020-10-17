require("dotenv").config();

import { GraphQLServer } from "graphql-yoga";
import { prisma } from "../generated/prisma-client";

import permissions from "./permissions";
import schema from "./schema";

import getCurrentUser from "./permissions/getCurrentUser";

const server = new GraphQLServer({
  schema,
  middlewares: [permissions],
  context: async ({ request }) => {
    const currentUser = await getCurrentUser(request);

    return {
      currentUser,
      prisma,
    };
  },
});

server.start({ port: 4000 }, () => {
  console.log("App running on http://localhost:4000");
});
