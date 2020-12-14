import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { flattenDeep } from "lodash";

import { prismaObjectType } from "nexus-prisma";
import { stringArg } from "nexus/dist";
import { dateArg } from "./Types";

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
  },
});

export default Mutation;
