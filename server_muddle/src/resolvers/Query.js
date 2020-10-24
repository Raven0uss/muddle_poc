import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { flattenDeep } from "lodash";

import { prismaObjectType, makePrismaSchema } from "nexus-prisma";
import { combineResolvers, skip } from "graphql-resolvers";
import { stringArg } from "nexus/dist";

// Queries
const exposedQueries = {
  adQueries: ["ad", "ads"],
  adTargetQueries: ["adTarget", "adTargets"],
  commentQueries: ["comment", "comments"],
  conversationQueries: ["conversation", "conversations"],
  interactionQueries: ["interaction", "interactions"],
  debateQueries: ["debate", "debates"],
  messageQueries: ["message", "messages"],
  notificationQueries: ["notification", "notifications"],
  reportQueries: ["report", "reports"],
  trophyQueries: ["trophy"],
  userQueries: ["users"],
};

const Query = prismaObjectType({
  name: "Query",
  definition(t) {
    t.prismaFields(flattenDeep(Object.values(exposedQueries).map((q) => q)));

    // SignIn
    t.field("signIn", {
      type: "Token",
      args: {
        email: stringArg(),
        password: stringArg(),
      },
      resolve: async (parent, { email, password }, { prisma }) => {
        try {
          const user = await prisma.user({ email });

          if (!user) {
            throw new Error("Invalid credentials");
          }

          const passwordMatch = bcrypt.compareSync(password, user.password);

          if (!passwordMatch) {
            throw new Error("Invalid credentials");
          }

          const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
            expiresIn: 36000,
          });

          return { token };
        } catch (error) {
          throw new Error(error);
        }
      },
    });

    // currentUser
    t.field("currentUser", {
      type: "User",
      args: {},
      resolve: async (parent, args, { prisma, currentUser }) => {
        const user = await prisma.user({ id: currentUser.user.id });
        return user;
      },
    });

    // trophies
    t.list.field("trophies", {
      type: "Trophy",
      args: {},
      resolve: async (parent, args, { prisma }) => {
        const trophies = await prisma.trophys();
        return trophies;
      },
    });
  },
});

export default Query;
