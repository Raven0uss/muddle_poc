import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { flattenDeep } from "lodash";

import { prismaObjectType, makePrismaSchema } from "nexus-prisma";
import { combineResolvers, skip } from "graphql-resolvers";
import { idArg, objectType, stringArg, arg } from "nexus/dist";

import Types from "./Types";

const dateArg = (options) => arg({ type: "DateTime", ...options });

const userIsAuthenticated = (parent, args, { currentUser }) => {
  return currentUser ? skip : new Error("Not authenticated");
};

// Queries
const exposedQueries = {
  adQueries: ["ad", "ads"],
  adTargetQueries: ["adTarget", "adTargets"],
  commentQueries: ["comment", "comments"],
  conversationQueries: ["conversation", "conversations"],
  interactionQueries: ["interaction", "interactions"],
  messageQueries: ["message", "messages"],
  reportQueries: ["report", "reports"],
  trophyQueries: ["trophy"],
  userQueries: ["users"],
};

// Mutations
const exposedMutations = {
  adMutations: ["createAd", "updateAd"],
  adTargetMutations: ["createAdTarget", "updateAdTarget"],
  commentMutations: ["createComment", "updateComment"],
  conversationMutations: ["createConversation", "updateConversation"],
  interactionMutations: ["createInteraction", "updateInteraction"],
  messageMutations: ["createMessage", "updateMessage"],
  reportMutations: ["createReport", "updateReport"],
  trophyMutations: ["createTrophy", "updateTrophy"],
  userMutations: ["updateUser"],
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
      args: {
        id: idArg(),
      },
      resolve: async (parent, { id }, { prisma, currentUser }) => {
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

const Mutation = prismaObjectType({
  name: "Mutation",
  definition(t) {
    t.prismaFields(flattenDeep(Object.values(exposedMutations).map((m) => m)));

    // signUp
    t.field("signUp", {
      type: "Token",
      args: {
        email: stringArg(),
        password: stringArg(),
        pseudo: stringArg(),
        birthdate: dateArg(),
      },
      resolve: async (
        parent,
        { email, password, pseudo, birthdate },
        { prisma }
      ) => {
        try {
          const hashedPassword = bcrypt.hashSync(password, 12);
          const user = await prisma.createUser({
            email,
            password: hashedPassword,
            pseudo,
            birthdate,
          });

          const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
            expiresIn: 36000,
          });

          return { token };
        } catch (error) {
          throw new Error(error);
        }
      },
    });
  },
});

export default {
  resolvers: {
    Mutation,
    Query,
    ...Types,
  },
};
