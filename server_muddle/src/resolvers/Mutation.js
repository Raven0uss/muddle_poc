import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { flattenDeep } from "lodash";

import { prismaObjectType } from "nexus-prisma";
import { idArg, stringArg } from "nexus/dist";
import { dateArg } from "./Types";

import timelimitToDateTime from "../algorithms/timelimitToDateTime";

// Mutations
const exposedMutations = {
  adMutations: ["createAd", "updateAd"],
  adTargetMutations: ["createAdTarget", "updateAdTarget"],
  commentMutations: ["createComment", "updateComment"],
  conversationMutations: ["createConversation", "updateConversation"],
  debateMutations: ["createDebate", "updateDebate"],
  interactionMutations: ["createInteraction", "updateInteraction"],
  messageMutations: ["createMessage", "updateMessage", "updateManyMessages"],
  notificationMutations: ["createNotification", "updateManyNotifications"],
  reportMutations: ["createReport", "updateReport"],
  trophyMutations: ["createTrophy", "updateTrophy"],
  userMutations: ["updateUser"],
};

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

    t.field("createPublicDebate", {
      type: "Debate",
      args: {
        content: stringArg(),
        answerOne: stringArg(),
        answerTwo: stringArg(),
        timelimit: stringArg(),
      },
      resolve: async (
        parent,
        { content, answerOne, answerTwo, timelimit },
        { prisma, currentUser }
      ) => {
        if (timelimit === "0 00") throw new Error("Timelimit is not correct");
        try {
          const limit = timelimitToDateTime(timelimit);
          const newDebate = await prisma.createDebate({
            owner: {
              connect: { id: currentUser.user.id },
            },
            content,
            answerOne,
            answerTwo,
            type: "STANDARD",
            timelimit: limit,
          });
          return newDebate;
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("createInvitationDuoDebate", {
      type: "Debate",
      args: {
        user: idArg(),
        content: stringArg(),
        answerOne: stringArg(),
        timelimit: stringArg(),
      },
      resolve: async (
        parent,
        { content, answerOne, timelimit, user },
        { prisma, currentUser }
      ) => {
        if (timelimit === "0 00") throw new Error("Timelimit is not correct");
        try {
          // const limit = timelimitToDateTime(timelimit);
          const newDebate = await prisma.createDebate({
            ownerBlue: {
              connect: { id: currentUser.user.id },
            },
            ownerRed: {
              connect: { id: user },
            },
            content,
            answerOne,
            type: "DUO",
            timelimitString: timelimit,
            published: false,
          });

          const notif = await prisma.createNotification({
            who: { connect: { id: currentUser.user.id } },
            userId: user,
            type: "INVITATION_DUO",
            status: "PENDING",
            debate: {
              connect: {
                id: newDebate.id,
              },
            },
            new: true,
          });

          return newDebate;
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("publishDuoDebate", {
      type: "Debate",
      args: {
        answerTwo: stringArg(),
        debateId: idArg(),
        timelimit: stringArg(),
      },
      resolve: async (
        parent,
        { debateId, answerTwo, timelimit },
        { prisma, currentUser }
      ) => {
        if (timelimit === "0 00") throw new Error("Timelimit is not correct");
        try {
          const limit = timelimitToDateTime(timelimit);
          const debate = await prisma.updateDebate({
            where: {
              id: debateId,
            },
            data: {
              timelimit: limit,
              answerTwo,
              published: true,
            },
          });
          return debate;
        } catch (err) {
          throw new Error(err);
        }
      },
    });
  },
});

export default Mutation;
