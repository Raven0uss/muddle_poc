require("dotenv").config();

// import cors from "cors";
// import express from "express";
// import jwt from "jsonwebtoken";
// import mongoose from "mongoose";
// import { ApolloServer, AuthenticationError } from "apollo-server-express";

import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import jwt from "jsonwebtoken";

import resolvers from "./resolvers";
import { Prisma } from "../prisma_muddle/generated/prisma-client";

// import schemas from "./schemas";
// import resolvers from "./resolvers";

// import adModel from "./models/adModel";
// import adTargetModel from "./models/adTargetModel";
// import commentModel from "./models/commentModel";
// import conversationModel from "./models/conversationModel";
// import debateModel from "./models/debateModel";
// import interactionModel from "./models/interactionModel";
// import messageModel from "./models/messageModel";
// import notificationModel from "./models/notificationModel";
// import reportModel from "./models/reportModel";
// import trophyModel from "./models/trophyModel";
// import userModel from "./models/userModel";
// import postModel from "./models/postModel";

// const app = express();
// app.use(cors());

// const getUser = async (req) => {
//   const token = req.headers["token"];

//   if (token) {
//     try {
//       return await jwt.verify(token, process.env.TOKEN_SECRET);
//     } catch (e) {
//       throw new AuthenticationError("Your session expired. Sign in again.");
//     }
//   }
// };

// const server = new ApolloServer({
//   typeDefs: schemas,
//   resolvers,
//   context: async ({ req }) => {
//     if (req) {
//       const me = await getUser(req);

//       return {
//         me,
//         models: {
//           adModel,
//           adTargetModel,
//           commentModel,
//           conversationModel,
//           debateModel,
//           interactionModel,
//           messageModel,
//           // notificationModel,
//           reportModel,
//           trophyModel,
//           userModel,
//           // postModel,
//         },
//       };
//     }
//   },
// });

// server.applyMiddleware({ app, path: "/graphql" });

// app.listen(4000, () => {
//   mongoose.connect(
//     process.env.CONNECTION_STRING,
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     (error) => {
//       if (error) console.log("Database Connection Error =>", error);

//       console.log("Database connected with success.");
//     }
//   );
// });

const typeDefs = importSchema("src/schemas/user.graphql");

export const db = new Prisma({
  endpoint: process.env.PRISMA_ENDPOINT || "http://localhost:4466",
  secret: process.env.PRISMA_SECRET || "",
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
