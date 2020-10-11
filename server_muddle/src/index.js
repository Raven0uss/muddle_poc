require("dotenv").config();

import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ApolloServer, AuthenticationError } from "apollo-server-express";

import schemas from "./schemas";
import resolvers from "./resolvers";

import adModel from "./models/adModel";
import adTargetModel from "./models/adTargetModel";
import commentModel from "./models/commentModel";
import conversationModel from "./models/conversationModel";
import debateModel from "./models/debateModel";
import interactionModel from "./models/interactionModel";
import messageModel from "./models/messageModel";
// import notificationModel from "./models/notificationModel";
import reportModel from "./models/reportModel";
import trophyModel from "./models/trophyModel";
import userModel from "./models/userModel";
// import postModel from "./models/postModel";

const app = express();
app.use(cors());

const getUser = async (req) => {
  const token = req.headers["token"];

  if (token) {
    try {
      return await jwt.verify(token, "riddlemethis"); // key have to change
    } catch (e) {
      throw new AuthenticationError("Your session expired. Sign in again.");
    }
  }
};

const server = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  context: async ({ req }) => {
    if (req) {
      const me = await getUser(req);

      return {
        me,
        models: {
          adModel,
          adTargetModel,
          commentModel,
          conversationModel,
          debateModel,
          interactionModel,
          messageModel,
          // notificationModel,
          reportModel,
          trophyModel,
          userModel,
          // postModel,
        },
      };
    }
  },
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen(4000, () => {
  mongoose.connect(
    process.env.CONNECTION_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error) => {
      if (error) console.log("Database Connection Error =>", error);

      console.log("Database connected with success.");
    }
  );
});
