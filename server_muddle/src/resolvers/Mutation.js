import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { flattenDeep, get, isNil } from "lodash";

import { prismaObjectType } from "nexus-prisma";
import { idArg, stringArg } from "nexus/dist";
import { dateArg } from "./Types";

import timelimitToDateTime from "../algorithms/timelimitToDateTime";

// Mutations
const exposedMutations = {
  adMutations: ["createAd", "updateAd"],
  adTargetMutations: ["createAdTarget", "updateAdTarget"],
  commentMutations: ["createComment", "updateComment", "deleteComment"],
  conversationMutations: ["createConversation", "updateConversation"],
  debateMutations: ["createDebate", "updateDebate", "deleteDebate"],
  interactionMutations: ["createInteraction", "updateInteraction"],
  messageMutations: ["createMessage", "updateMessage", "updateManyMessages"],
  notificationMutations: [
    "createNotification",
    "updateManyNotifications",
    "updateNotification",
  ],
  reportMutations: ["createReport", "updateReport"],
  trophyMutations: ["createTrophy", "updateTrophy"],
  userMutations: ["updateUser"],
};

const fragmentGetAllComments = `
  fragment GetAllComments on Debate  {
    id
    comments {
      id
      from {
        id
      }
      likes {
        id
      }
    }
  }
`;

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

    t.field("deleteMyDebate", {
      type: "Debate",
      args: {
        debateId: idArg(),
      },
      resolve: async (parent, { debateId }, { prisma, currentUser }) => {
        try {
          const notifications = await prisma.notifications({
            where: {
              debate: {
                id: debateId,
              },
            },
          });

          const interactions = await prisma.interactions({
            where: {
              debate: {
                id: debateId,
              },
            },
          });

          const trophies = await prisma.trophies({
            where: {
              debate: {
                id: debateId,
              },
            },
          });

          const comments = await prisma.comments({
            where: {
              debate: {
                id: debateId,
              },
            },
          });

          const reports = await prisma.reports({
            where: {
              debate: {
                id: debateId,
              },
            },
          });

          Promise.all(
            notifications.map(
              async (n) => await prisma.deleteNotification({ id: n.id })
            )
          );

          Promise.all(
            interactions.map(
              async (i) => await prisma.deleteInteraction({ id: i.id })
            )
          );

          Promise.all(
            trophies.map(async (t) => await prisma.deleteTrophy({ id: t.id }))
          );

          Promise.all(
            comments.map(async (c) => await prisma.deleteComment({ id: c.id }))
          );

          Promise.all(
            reports.map(async (r) => await prisma.deleteReport({ id: r.id }))
          );

          const d = await prisma.deleteDebate({ id: debateId });
          return d;
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("deleteMyComment", {
      type: "Comment",
      args: {
        commentId: idArg(),
      },
      resolve: async (parent, { commentId }, { prisma, currentUser }) => {
        try {
          const notifications = await prisma.notifications({
            where: {
              comment: {
                id: commentId,
              },
            },
          });

          const interactions = await prisma.interactions({
            where: {
              comment: {
                id: commentId,
              },
            },
          });

          const comments = await prisma.comment({ id: commentId }).comments();

          const trophies = await prisma.trophies({
            where: {
              comment: {
                id: commentId,
              },
            },
          });

          const reports = await prisma.reports({
            where: {
              comment: {
                id: commentId,
              },
            },
          });

          Promise.all(
            notifications.map(
              async (n) => await prisma.deleteNotification({ id: n.id })
            )
          );

          Promise.all(
            interactions.map(
              async (i) => await prisma.deleteInteraction({ id: i.id })
            )
          );

          Promise.all(
            comments.map(async (c) => await prisma.deleteComment({ id: c.id }))
          );

          Promise.all(
            trophies.map(async (t) => await prisma.deleteTrophy({ id: t.id }))
          );

          Promise.all(
            reports.map(async (r) => await prisma.deleteReport({ id: r.id }))
          );

          const c = await prisma.deleteComment({ id: commentId });
          return c;
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("closeMyDebate", {
      type: "Debate",
      args: {
        debateId: idArg(),
      },
      resolve: async (parent, { debateId }, { prisma, currentUser }) => {
        const debate = await prisma.updateDebate({
          where: { id: debateId },
          data: {
            closed: true,
          },
        });

        if (debate.type === "DUO") {
          const redVotes = await prisma.debate({ id: debateId }).redVotes();
          const blueVotes = await prisma.debate({ id: debateId }).blueVotes();

          if (redVotes.length === blueVotes.length) return debate;

          const ownerRed = await prisma.debate({ id: debateId }).ownerRed();
          const ownerBlue = await prisma.debate({ id: debateId }).ownerBlue();

          const winnerId =
            redVotes.length > blueVotes.length ? ownerRed.id : ownerBlue.id;

          const trophyDuo = await prisma.createTrophy({
            user: { connect: { id: winnerId } },
            won: true,
            type: "DUO",
            debate: { connect: { id: debate.id } },
          });
        } else {
          const debateComments = await prisma
            .debate({
              id: debateId,
              // comments_some: { id_not: currentUser.user.id },
            })
            .$fragment(fragmentGetAllComments);

          const comments = get(debateComments, "comments");
          if (isNil(comments) || comments.length === 0) return debate;

          const sortedComments = comments
            .filter((c) => c.from.id !== currentUser.user.id)
            .sort((a, b) => b.likes.length - a.likes.length);
          if (sortedComments.length === 0) return debate;
          if (sortedComments[0].likes.length === 0) return debate;

          const topCommentId = {
            comment: sortedComments[0].id,
            user: sortedComments[0].from.id,
          };

          const trophyComment = await prisma.createTrophy({
            user: { connect: { id: topCommentId.user } },
            won: true,
            type: "TOP_COMMENT",
            debate: { connect: { id: debate.id } },
            comment: { connect: { id: topCommentId.comment } },
          });

          // Don't use this feature or have to implement remove topComment when deleteComment
          // const updatedDebate = await prisma.updateDebate({
          //   where: { id: debate.id },
          //   data: {
          //     topComment: {
          //       connect: { id: topCommentId.comment },
          //     },
          //   },
          // });
        }
        return debate;
      },
    });

    // askCloseDebate => Duo
    t.field("askCloseDebate", {
      type: "Debate",
      args: {
        debateId: idArg(),
        userId: stringArg(),
      },
      resolve: async (
        parent,
        { debateId, userId },
        { prisma, currentUser }
      ) => {
        const debate = await prisma.debate({ id: debateId });
        if (isNil(debate)) throw new Error("Debate doesn't exist");

        const notification = await prisma.createNotification({
          who: {
            connect: {
              id: currentUser.user.id,
            },
          },
          userId,
          type: "CLOSE_DEBATE",
          new: true,
          status: "PENDING",
          debate: { connect: { id: debateId } },
        });

        return debate;
      },
    });

    // askDeleteDebate => Duo
    t.field("askDeleteDebate", {
      type: "Debate",
      args: {
        debateId: idArg(),
        userId: stringArg(),
      },
      resolve: async (
        parent,
        { debateId, userId },
        { prisma, currentUser }
      ) => {
        const debate = await prisma.debate({ id: debateId });
        if (isNil(debate)) throw new Error("Debate doesn't exist");

        const notification = await prisma.createNotification({
          who: {
            connect: {
              id: currentUser.user.id,
            },
          },
          userId,
          type: "DELETE_DEBATE",
          new: true,
          status: "PENDING",
          debate: { connect: { id: debateId } },
        });

        return debate;
      },
    });

    // t.field("imageUpload", {
    //   type: "ImageURI",
    //   args: {
    //     localUri: stringArg(),
    //   },
    //   resolve: async (parent, { localUri }, ctx) => {
    //     return {
    //       image: "test",
    //     };
    //   },
    // });
  },
});

export default Mutation;
