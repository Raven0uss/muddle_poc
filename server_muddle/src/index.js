require("dotenv").config();

import { stringArg, idArg } from "nexus";
import { makePrismaSchema } from "nexus-prisma";
import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";

import jwt from "jsonwebtoken";
import * as path from "path";

import resolvers from "./resolvers";
import { prisma } from "../generated/prisma-client";
import datamodelInfo from "../generated/nexus-prisma/datamodel-info";

import { rule, shield, and, or, not } from "graphql-shield";

const schema = makePrismaSchema({
  types: resolvers,

  prisma: {
    datamodelInfo,
    client: prisma,
  },

  outputs: {
    schema: path.join(__dirname, "../generated/schema.graphql"),
    typegen: path.join(__dirname, "../generated/nexus-prisma/index.js"),
  },
});

const getCurrentUser = async (request) => {
  if (!request.headers.token) {
    return null;
  }
  const user = await jwt.decode(
    request.headers.token,
    process.env.JWT_SECRET_KEY
  );
  return { ...user };
};

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.currentUser !== null;
  }
);

const permissions = shield({
  Query: {
    users: isAuthenticated,
  },
  // Mutation: {
  //   addFruitToBasket: isAuthenticated,
  // },
});

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
