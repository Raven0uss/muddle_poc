import "dotenv/config";

const jwt = require("jsonwebtoken");

import express from "express";
import morgan from "morgan";

import path from "path";

import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";

import resolvers from "./resolvers";
import { Prisma, prisma } from "../prisma/generated/prisma-client";

import { prismaObjectType, makePrismaSchema } from "nexus-prisma";
import datamodelInfo from "../prisma/generated/nexus-prisma";
import { type } from "os";

const app = express();
app.use(morgan("dev"));

const typeDefs = importSchema("src/schemas/user.graphql");

export const db = new Prisma({
  endpoint: process.env.PRISMA_ENDPOINT || "http://localhost:4466",
  secret: process.env.PRISMA_SECRET || "",
});

const Query = prismaObjectType({
  name: "Query",
  definition(t: any) {
    t.prismaFields(["user"]);

    t.field('test', {
        type: 'Int',
        args: {},
        resolve: (parent) => {
            return 0;
        }
    })
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
    typegen: path.join(__dirname, "../generated/nexus.ts"),
  },
});

const getCurrentUser = async (request: any) => {
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
  schema: schema,
  typeDefs,
  resolvers,
  context: async ({ request }) => {
    const me = await getCurrentUser(request);

    return {
      me,
      prisma: db,
    };
  },
});
server.start({ port: 4000 }, () => {
  console.log("App running on http://localhost:4000");
});
