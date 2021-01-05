import { makePrismaSchema } from "nexus-prisma";

import resolvers from "./resolvers";
import datamodelInfo from "../prisma/generated/nexus-prisma/datamodel-info";
import { prisma } from "../prisma/generated/prisma-client";

import * as path from "path";

export default makePrismaSchema({
  types: resolvers,

  prisma: {
    datamodelInfo,
    client: prisma,
  },

  outputs: {
    schema: path.join(__dirname, "../prisma/generated/schema.graphql"),
    typegen: path.join(__dirname, "../prisma/generated/nexus-prisma/index.js"),
  },
});
