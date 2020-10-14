import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prismaObjectType, makePrismaSchema } from "nexus-prisma";
import { combineResolvers, skip } from "graphql-resolvers";
import { idArg, objectType, stringArg } from "nexus/dist";

const userIsAuthenticated = (parent, args, { me }) => {
  return me ? skip : new Error("Not authenticated");
};

const Token = objectType({
  name: "Token",
  definition(t) {
    t.string("token");
  },
});

const Query = prismaObjectType({
  name: "Query",
  definition(t) {
    t.prismaFields(["user"]);

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

    t.field("me", {
      type: "User",
      args: {
        id: idArg(),
      },
      resolve: async (parent, { id }, { prisma, me }) => {
        const user = await prisma.user({ id: me.user.id });
        return user;
      },
    });

    t.field("getUser", {
      type: "User",
      args: { id: idArg() },
      resolve: combineResolvers(
        userIsAuthenticated,
        async (parent, { id }, { prisma }) => {
          const user = await prisma.user({ id });
          return user;
        }
      ),
    });
  },
});

const Mutation = prismaObjectType({
  name: "Mutation",
  definition(t) {
    t.field("signUp", {
      type: "Token",
      args: { email: stringArg(), password: stringArg() },
      resolve: async (parent, { email, password }, { prisma }) => {
        try {
          const hashedPassword = bcrypt.hashSync(password, 12);
          const user = await prisma.createUser({
            email,
            password: hashedPassword,
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
    Token,
  },
};