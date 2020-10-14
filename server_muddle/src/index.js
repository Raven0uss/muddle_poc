require("dotenv").config();

import { stringArg, idArg } from "nexus";
import { prismaObjectType, makePrismaSchema } from "nexus-prisma";
import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";

import jwt from "jsonwebtoken";
import * as path from "path";

import resolvers from "./resolvers";
import { prisma } from "../generated/prisma-client";
import datamodelInfo from "../generated/nexus-prisma/datamodel-info";

const typeDefs = importSchema("src/schemas/user.graphql");

const Query = prismaObjectType({
  name: "Query",
  definition(t) {
    t.prismaFields(["user"]);
    // t.list.field("feed", {
    //   type: "Post",
    //   resolve: (_, args, ctx) =>
    //     ctx.prisma.posts({ where: { published: true } }),
    // });
    // t.list.field("postsByUser", {
    //   type: "Post",
    //   args: { email: stringArg() },
    //   resolve: (_, { email }, ctx) =>
    //     ctx.prisma.posts({ where: { author: { email } } }),
    // });
  },
});

const schema = makePrismaSchema({
  types: [Query],

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

const server = new GraphQLServer({
//   schema,
  typeDefs,
  resolvers,
  context: async ({ request }) => {
    const me = await getCurrentUser(request);

    return {
      me,
      prisma,
    };
  },
});

server.start({ port: 4000 }, () => {
  console.log("App running on http://localhost:4000");
});
