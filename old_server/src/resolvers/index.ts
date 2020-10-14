// import { GraphQLScalarType } from "graphql";
// import dayjs from "dayjs";

// import adResolver from "./adResolver";
// import adTargetResolver from "./adTargetResolver";
// import commentResolver from "./commentResolver";
// import conversationResolver from "./conversationResolver";
// import debateResolver from "./debateResolver";
// import interactionResolver from "./interactionResolver";
// import messageResolver from "./messageResolver";
// import notificationResolver from "./notificationResolver";
// import reportResolver from "./reportResolver";
// import trophyResolver from "./trophyResolver";
// import userResolver from "./userResolver";

// export default [
//   {
//     Date: new GraphQLScalarType({
//       name: "Date",
//       description: "Date custom scalar type",
//       parseValue(value) {
//         return new Date(value); // Value from the client
//       },
//       serialize(value) {
//         return value.getTime(); // Value sent to the client
//       },
//       parseLiteral(ast) {
//         // console.log(ast);
//         if (ast.kind === "IntValue") {
//           return parseInt(ast.value, 10);
//         }
//         if (ast.kind === "StringValue") {
//           return dayjs(ast.value);
//         }
//         return null;
//       },
//     }),
//   },
//   adResolver,
//   adTargetResolver,
//   commentResolver,
//   conversationResolver,
//   debateResolver,
//   interactionResolver,
//   messageResolver,
//   notificationResolver,
//   reportResolver,
//   trophyResolver,
//   userResolver,
// ];

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { combineResolvers, skip } from "graphql-resolvers";

const userIsAuthenticated = (parent, args, { me }) => {
  return me ? skip : new Error("Not authenticated");
};

export default {
  Query: {
    getUser: combineResolvers(
      userIsAuthenticated,
      async (parent, { id }, { prisma }) => {
        const user = await prisma.user({ id });
        return user;
      }
    ),
    signIn: async (parent, { email, password }, { prisma }) => {
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
    me: async (parent, { id }, { prisma, me }) => {
      const user = await prisma.user({ id: me.user.id });
      return user;
    },
  },
  Mutation: {
    signUp: async (parent, { email, password }, { prisma }) => {
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
  },
};
