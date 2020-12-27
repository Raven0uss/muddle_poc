import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { flattenDeep, get, isEmpty, isNil } from "lodash";

import { prismaObjectType } from "nexus-prisma";
import { booleanArg, idArg, stringArg } from "nexus/dist";
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
    "deleteManyNotifications",
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

const fragmentGetSingleComment = `
  fragment GetAllComments on Comment  {
    id
    from {
      id
    }
    likes {
      id
    }
    dislikes {
      id
    }
  }
`;

const fragmentDebateVotes = `
  fragment GetDebateVotes on Debate {
    id
    owner {
      id
    }
    ownerRed {
      id
    }
    ownerBlue {
      id
    }
    positives {
      id
    }
    negatives {
      id
    }
    blueVotes {
      id
    }
    redVotes {
      id
    }
  }
`;

const fragmentNotif = `
  fragment GetNotificationWho on Notification {
    id
    who {
      id
    }
  }
`;

const fragmentDebateOwner = `
  fragment GetDebateOwner on Debate {
    id
    type
    owner {
      id
    }
    ownerRed {
      id
    }
    ownerBlue {
      id
    }
  }
`;

const fragmentCommentFrom = `
  fragment GetCommentFrom on Comment {
    id
    from {
      id
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
        firstname: stringArg(),
        lastname: stringArg(),
        birthdate: dateArg(),
      },
      resolve: async (
        parent,
        { email, password, firstname, lastname, birthdate },
        { prisma }
      ) => {
        try {
          const hashedPassword = bcrypt.hashSync(password, 12);
          const user = await prisma.createUser({
            email,
            password: hashedPassword,
            firstname,
            lastname,
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
        image: stringArg(),
        crowned: booleanArg(),
      },
      resolve: async (
        parent,
        { content, answerOne, answerTwo, timelimit, image, crowned },
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
            image,
            crowned,
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
        image: stringArg(),
      },
      resolve: async (
        parent,
        { content, answerOne, timelimit, user, image },
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
            image,
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

          await Promise.all(
            notifications.map(
              async (n) => await prisma.deleteNotification({ id: n.id })
            )
          );

          await Promise.all(
            interactions.map(
              async (i) => await prisma.deleteInteraction({ id: i.id })
            )
          );

          await Promise.all(
            trophies.map(async (t) => await prisma.deleteTrophy({ id: t.id }))
          );

          await Promise.all(
            comments.map(async (c) => await prisma.deleteComment({ id: c.id }))
          );

          await Promise.all(
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

          await Promise.all(
            notifications.map(
              async (n) => await prisma.deleteNotification({ id: n.id })
            )
          );

          await Promise.all(
            interactions.map(
              async (i) => await prisma.deleteInteraction({ id: i.id })
            )
          );

          await Promise.all(
            comments.map(async (c) => await prisma.deleteComment({ id: c.id }))
          );

          await Promise.all(
            trophies.map(async (t) => await prisma.deleteTrophy({ id: t.id }))
          );

          await Promise.all(
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
        try {
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
        } catch (err) {
          throw new Error(err);
        }
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
        try {
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
        } catch (err) {
          throw new Error(err);
        }
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
        try {
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
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("likeComment", {
      type: "Comment",
      args: {
        commentId: idArg(),
        userId: idArg(),
      },
      resolve: async (
        parent,
        { commentId, userId },
        { prisma, currentUser }
      ) => {
        try {
          const comment = await prisma
            .comment({ id: commentId })
            .$fragment(fragmentGetSingleComment);

          if (isNil(comment) || isEmpty(comment)) {
            throw new Error("Comment doesn't exist");
          }

          // Check if already liked
          const index = comment.likes.findIndex((like) => like.id === userId);
          if (index !== -1) return comment;

          // Check if dislike
          const dislikeIndex = comment.dislikes.findIndex(
            (dislike) => dislike.id === userId
          );

          // search existing notification
          const notificationLike = await prisma.notifications({
            where: {
              userId: comment.from.id,
              type: "LIKE",
              comment: { id: commentId },
            },
          });
          if (comment.from.id !== currentUser.user.id)
            if (isEmpty(notificationLike)) {
              await prisma.createNotification({
                who: { connect: { id: currentUser.user.id } },
                userId: comment.from.id,
                type: "LIKE",
                status: "INFORMATION",
                new: true,
                comment: { connect: { id: commentId } },
              });
            } else {
              await prisma.updateNotification({
                where: {
                  id: notificationLike[0].id,
                },
                data: {
                  who: { connect: { id: currentUser.user.id } },
                  new: true,
                },
              });
            }

          if (dislikeIndex !== -1) {
            const updatedComment = await prisma.updateComment({
              where: { id: commentId },
              data: {
                likes: { connect: { id: userId } },
                dislikes: { disconnect: { id: userId } },
              },
            });
            return updatedComment;
          } else {
            const updatedCommentWithoutDisconnect = await prisma.updateComment({
              where: { id: commentId },
              data: {
                likes: { connect: { id: userId } },
              },
            });
            return updatedCommentWithoutDisconnect;
          }
          return comment;
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("dislikeComment", {
      type: "Comment",
      args: {
        commentId: idArg(),
        userId: idArg(),
      },
      resolve: async (
        parent,
        { commentId, userId },
        { prisma, currentUser }
      ) => {
        try {
          const comment = await prisma
            .comment({ id: commentId })
            .$fragment(fragmentGetSingleComment);

          if (isNil(comment) || isEmpty(comment)) {
            throw new Error("Comment doesn't exist");
          }

          // Check if already disliked
          const index = comment.dislikes.findIndex(
            (dislike) => dislike.id === userId
          );
          if (index !== -1) return comment;

          // Check if dislike
          const likeIndex = comment.likes.findIndex(
            (like) => like.id === userId
          );

          // console.log(userId);
          // const stringUserId = `${userId}`;
          // search existing notification
          const notificationDislike = await prisma.notifications({
            where: {
              userId: comment.from.id,
              type: "DISLIKE",
              comment: { id: commentId },
            },
          });
          if (comment.from.id !== currentUser.user.id)
            if (isEmpty(notificationDislike)) {
              await prisma.createNotification({
                who: { connect: { id: currentUser.user.id } },
                userId: comment.from.id,
                type: "DISLIKE",
                status: "INFORMATION",
                new: true,
                comment: { connect: { id: commentId } },
              });
            } else {
              await prisma.updateNotification({
                where: {
                  id: notificationDislike[0].id,
                },
                data: {
                  who: { connect: { id: currentUser.user.id } },
                  new: true,
                },
              });
            }

          if (likeIndex !== -1) {
            const updatedComment = await prisma.updateComment({
              where: { id: commentId },
              data: {
                likes: { disconnect: { id: userId } },
                dislikes: { connect: { id: userId } },
              },
            });
            return updatedComment;
          } else {
            const updatedCommentWithoutDisconnect = await prisma.updateComment({
              where: { id: commentId },
              data: {
                dislikes: { connect: { id: userId } },
              },
            });
            return updatedCommentWithoutDisconnect;
          }
          return comment;
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("sendVote", {
      type: "Debate",
      args: {
        debateId: idArg(),
        userId: idArg(),
        type: stringArg(),
      },
      resolve: async (
        parent,
        { debateId, userId, type },
        { prisma, currentUser }
      ) => {
        try {
          const debate = await prisma
            .debate({ id: debateId })
            .$fragment(fragmentDebateVotes);
          if (isNil(debate)) throw new Error("Debate doesn't exist");

          // search existing notification
          if (type === "positive" || type == "negative") {
            const notificationVoteStandard = await prisma.notifications({
              where: {
                userId: debate.owner.id,
                type: "VOTE",
                debate: { id: debateId },
              },
            });
            if (debate.owner.id !== currentUser.user.id)
              if (isEmpty(notificationVoteStandard)) {
                await prisma.createNotification({
                  who: { connect: { id: currentUser.user.id } },
                  userId: debate.owner.id,
                  type: "VOTE",
                  status: "INFORMATION",
                  new: true,
                  debate: { connect: { id: debateId } },
                });
              } else {
                await prisma.updateNotification({
                  where: {
                    id: notificationVoteStandard[0].id,
                  },
                  data: {
                    who: { connect: { id: currentUser.user.id } },
                    new: true,
                  },
                });
              }
          }

          if (type === "blue" || type === "red") {
            const notificationVoteRed = await prisma.notifications({
              where: {
                userId: debate.ownerRed.id,
                type: "VOTE",
                debate: { id: debateId },
              },
            });
            const notificationVoteBlue = await prisma.notifications({
              where: {
                userId: debate.ownerBlue.id,
                type: "VOTE",
                debate: { id: debateId },
              },
            });
            if (
              debate.ownerBlue.id !== currentUser.user.id &&
              debate.ownerRed.id !== currentUser.user.id
            ) {
              if (isEmpty(notificationVoteRed)) {
                await prisma.createNotification({
                  who: { connect: { id: currentUser.user.id } },
                  userId: debate.ownerRed.id,
                  type: "VOTE",
                  status: "INFORMATION",
                  new: true,
                  debate: { connect: { id: debateId } },
                });
              } else {
                await prisma.updateNotification({
                  where: {
                    id: notificationVoteRed[0].id,
                  },
                  data: {
                    who: { connect: { id: currentUser.user.id } },
                    new: true,
                  },
                });
              }
              if (isEmpty(notificationVoteBlue)) {
                await prisma.createNotification({
                  who: { connect: { id: currentUser.user.id } },
                  userId: debate.ownerBlue.id,
                  type: "VOTE",
                  status: "INFORMATION",
                  new: true,
                  debate: { connect: { id: debateId } },
                });
              } else {
                await prisma.updateNotification({
                  where: {
                    id: notificationVoteBlue[0].id,
                  },
                  data: {
                    who: { connect: { id: currentUser.user.id } },
                    new: true,
                  },
                });
              }
            }
          }

          switch (type) {
            case "positive": {
              if (
                debate.positives.findIndex((p) => p.id === userId) !== -1 ||
                debate.negatives.findIndex((p) => p.id === userId) !== -1
              ) {
                return debate;
              }

              const positiveVote = await prisma.updateDebate({
                where: { id: debateId },
                data: { positives: { connect: { id: userId } } },
              });
              await prisma.createInteraction({
                type: "POSITIVE_VOTE",
                who: {
                  connect: {
                    id: currentUser.user.id,
                  },
                },
                debate: {
                  connect: {
                    id: debateId,
                  },
                },
              });
              return positiveVote;
            }
            case "negative": {
              if (
                debate.negatives.findIndex((p) => p.id === userId) !== -1 ||
                debate.positives.findIndex((p) => p.id === userId) !== -1
              ) {
                return debate;
              }
              const negativeVote = await prisma.updateDebate({
                where: { id: debateId },
                data: { negatives: { connect: { id: userId } } },
              });
              await prisma.createInteraction({
                type: "NEGATIVE_VOTE",
                who: {
                  connect: {
                    id: currentUser.user.id,
                  },
                },
                debate: {
                  connect: {
                    id: debateId,
                  },
                },
              });
              return negativeVote;
            }
            case "blue": {
              if (
                debate.blueVotes.findIndex((p) => p.id === userId) !== -1 ||
                debate.redVotes.findIndex((p) => p.id === userId) !== -1
              ) {
                return debate;
              }
              const blueVote = await prisma.updateDebate({
                where: { id: debateId },
                data: { blueVotes: { connect: { id: userId } } },
              });

              await prisma.createInteraction({
                type: "BLUE_VOTE",
                who: {
                  connect: {
                    id: currentUser.user.id,
                  },
                },
                debate: {
                  connect: {
                    id: debateId,
                  },
                },
              });

              return blueVote;
              break;
            }
            case "red": {
              if (
                debate.blueVotes.findIndex((p) => p.id === userId) !== -1 ||
                debate.redVotes.findIndex((p) => p.id === userId) !== -1
              ) {
                return debate;
              }
              const redVote = await prisma.updateDebate({
                where: { id: debateId },
                data: { redVotes: { connect: { id: userId } } },
              });
              await prisma.createInteraction({
                type: "RED_VOTE",
                who: {
                  connect: {
                    id: currentUser.user.id,
                  },
                },
                debate: {
                  connect: {
                    id: debateId,
                  },
                },
              });
              return redVote;
            }
            default:
              throw new Error("Bad type");
          }
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("notifyComment", {
      type: "NoValue",
      args: {
        debateId: idArg(),
      },
      resolve: async (parent, { debateId }, { prisma, currentUser }) => {
        try {
          const debate = await prisma
            .debate({ id: debateId })
            .$fragment(fragmentDebateOwner);

          if (isNil(debate)) throw new Error("Debate doesnt exist");

          if (debate.type === "DUO") {
            const notificationsRed = await prisma.notifications({
              where: {
                userId: debate.ownerRed.id,
                type: "COMMENT",
                debate: { id: debateId },
              },
            });
            const notificationsBlue = await prisma.notifications({
              where: {
                userId: debate.ownerBlue.id,
                type: "COMMENT",
                debate: { id: debateId },
              },
            });

            if (debate.ownerRed.id !== currentUser.user.id) {
              if (isEmpty(notificationsRed)) {
                await prisma.createNotification({
                  who: { connect: { id: currentUser.user.id } },
                  userId: debate.ownerRed.id,
                  type: "COMMENT",
                  status: "INFORMATION",
                  new: true,
                  debate: { connect: { id: debateId } },
                });
              } else {
                await prisma.updateNotification({
                  where: {
                    id: notificationsRed[0].id,
                  },
                  data: {
                    who: { connect: { id: currentUser.user.id } },
                    new: true,
                  },
                });
              }
            }

            if (debate.ownerBlue.id !== currentUser.user.id) {
              if (isEmpty(notificationsBlue)) {
                await prisma.createNotification({
                  who: { connect: { id: currentUser.user.id } },
                  userId: debate.ownerBlue.id,
                  type: "COMMENT",
                  status: "INFORMATION",
                  new: true,
                  debate: { connect: { id: debateId } },
                });
              } else {
                await prisma.updateNotification({
                  where: {
                    id: notificationsBlue[0].id,
                  },
                  data: {
                    who: { connect: { id: currentUser.user.id } },
                    new: true,
                  },
                });
              }
            }
          } else {
            const notifications = await prisma.notifications({
              where: {
                userId: debate.owner.id,
                type: "COMMENT",
                debate: { id: debateId },
              },
            });

            if (debate.owner.id !== currentUser.user.id) {
              if (isEmpty(notifications)) {
                await prisma.createNotification({
                  who: { connect: { id: currentUser.user.id } },
                  userId: debate.owner.id,
                  type: "COMMENT",
                  status: "INFORMATION",
                  new: true,
                  debate: { connect: { id: debateId } },
                });
              } else {
                await prisma.updateNotification({
                  where: {
                    id: notifications[0].id,
                  },
                  data: {
                    who: { connect: { id: currentUser.user.id } },
                    new: true,
                  },
                });
              }
            }
          }
          return { value: 0 };
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("notifySubComment", {
      type: "NoValue",
      args: {
        debateId: idArg(),
        commentId: idArg(),
      },
      resolve: async (
        parent,
        { debateId, commentId },
        { prisma, currentUser }
      ) => {
        try {
          // Here for the owner debate
          const debate = await prisma
            .debate({ id: debateId })
            .$fragment(fragmentDebateOwner);

          if (isNil(debate)) throw new Error("Debate doesnt exist");

          if (debate.type === "DUO") {
            const notificationsRed = await prisma.notifications({
              where: {
                userId: debate.ownerRed.id,
                type: "COMMENT",
                debate: { id: debateId },
              },
            });
            const notificationsBlue = await prisma.notifications({
              where: {
                userId: debate.ownerBlue.id,
                type: "COMMENT",
                debate: { id: debateId },
              },
            });

            if (debate.ownerRed.id !== currentUser.user.id) {
              if (isEmpty(notificationsRed)) {
                await prisma.createNotification({
                  who: { connect: { id: currentUser.user.id } },
                  userId: debate.ownerRed.id,
                  type: "COMMENT",
                  status: "INFORMATION",
                  new: true,
                  debate: { connect: { id: debateId } },
                });
              } else {
                await prisma.updateNotification({
                  where: {
                    id: notificationsRed[0].id,
                  },
                  data: {
                    who: { connect: { id: currentUser.user.id } },
                    new: true,
                  },
                });
              }
            }

            if (debate.ownerBlue.id !== currentUser.user.id) {
              if (isEmpty(notificationsBlue)) {
                await prisma.createNotification({
                  who: { connect: { id: currentUser.user.id } },
                  userId: debate.ownerBlue.id,
                  type: "COMMENT",
                  status: "INFORMATION",
                  new: true,
                  debate: { connect: { id: debateId } },
                });
              } else {
                await prisma.updateNotification({
                  where: {
                    id: notificationsBlue[0].id,
                  },
                  data: {
                    who: { connect: { id: currentUser.user.id } },
                    new: true,
                  },
                });
              }
            }
          } else {
            const notifications = await prisma.notifications({
              where: {
                userId: debate.owner.id,
                type: "COMMENT",
                debate: { id: debateId },
              },
            });

            if (debate.owner.id !== currentUser.user.id) {
              if (isEmpty(notifications)) {
                await prisma.createNotification({
                  who: { connect: { id: currentUser.user.id } },
                  userId: debate.owner.id,
                  type: "COMMENT",
                  status: "INFORMATION",
                  new: true,
                  debate: { connect: { id: debateId } },
                });
              } else {
                await prisma.updateNotification({
                  where: {
                    id: notifications[0].id,
                  },
                  data: {
                    who: { connect: { id: currentUser.user.id } },
                    new: true,
                  },
                });
              }
            }
          }

          // Here for the comment owner
          const comment = await prisma
            .comment({ id: commentId })
            .$fragment(fragmentCommentFrom);

          if (isNil(comment)) throw new Error("comment doesnt exist");

          const commentNotification = await prisma.notifications({
            where: {
              userId: comment.from.id,
              type: "SUBCOMMENT",
              comment: { id: commentId },
            },
          });

          if (comment.from.id !== currentUser.user.id) {
            if (isEmpty(commentNotification)) {
              await prisma.createNotification({
                who: { connect: { id: currentUser.user.id } },
                userId: comment.from.id,
                type: "SUBCOMMENT",
                status: "INFORMATION",
                new: true,
                comment: { connect: { id: commentId } },
              });
            } else {
              await prisma.updateNotification({
                where: {
                  id: notifications[0].id,
                },
                data: {
                  who: { connect: { id: currentUser.user.id } },
                  new: true,
                },
              });
            }
          }

          return { value: 0 };
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("deleteThisConversation", {
      type: "NoValue",
      args: {
        conversationId: idArg(),
      },
      resolve: async (parent, { conversationId }, { prisma, currentUser }) => {
        try {
          const conversation = await prisma
            .conversation({ id: conversationId })
            .$fragment(
              `
              fragment GetConversationMessages on Conversation {
                id
                messages {
                  id
                  deleted
                }
              }
            `
            );
          if (isNil(conversation)) throw new Error("conv does not exist");

          const messages = get(conversation, "messages");
          if (isNil(messages)) throw new Error("messages are nil");
          await Promise.all(
            messages.map(async (m) => {
              if (isEmpty(m.deleted))
                return await prisma.updateMessage({
                  where: { id: m.id },
                  data: {
                    deleted: currentUser.user.id,
                  },
                });
              else {
                return await prisma.deleteMessage({ id: m.id });
              }
            })
          );
          // await prisma.updateConversation({ where: {id: conversation.id }, data: {
          //   deleted:
          // }});
          return { value: 0 };
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("deleteMessages", {
      type: "NoValue",
      args: {
        messagesIdPayload: stringArg(),
      },
      resolve: async (
        parent,
        { messagesIdPayload },
        { prisma, currentUser }
      ) => {
        try {
          const messagesIdObject = JSON.parse(messagesIdPayload);
          const messagesId = get(messagesIdObject, "messagesId");
          if (isNil(messagesId))
            throw new Error("bad payload for deleteMessages");
          // console.log(messagesId);
          await Promise.all(
            messagesId.map(async (m) => {
              //     const message = await prisma.message({ id: m.id });
              if (isEmpty(m.deleted))
                return await prisma.updateMessage({
                  where: { id: m.id },
                  data: {
                    deleted: currentUser.user.id,
                  },
                });
              else {
                return await prisma.deleteMessage({ id: m.id });
              }
            })
          );
          return { value: 0 };
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("giveCrown", {
      type: "User",
      args: {
        userId: idArg(),
      },
      resolve: async (parent, { userId }, { prisma }) => {
        try {
          const user = await prisma.user({ id: userId });
          if (isNil(user)) throw new Error("user doesnt exist");

          const updatedUser = await prisma.updateUser({
            where: {
              id: userId,
            },
            data: {
              crowned: true,
              crownedDate: new Date(),
            },
          });
          const getMuddleAccount = await prisma.users({
            where: {
              role: "MUDDLE",
            },
          });
          if (isNil(getMuddleAccount)) throw new Error("muddle doesnt exist");
          const muddleAccount = get(getMuddleAccount, "[0].id");
          console.log(muddleAccount);
          if (isNil(muddleAccount)) throw new Error("muddle doesnt exist");
          const notif = await prisma.createNotification({
            who: {
              connect: {
                id: muddleAccount,
              },
            },
            userId,
            type: "CROWNED",
            status: "INFORMATION",
            new: true,
          });
          return updatedUser;
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    // t.field("blockUser", {
    //   type: "User",
    //   args: {
    //     userId: idArg()
    //   },
    //   resolve: async (parent, { userId }, { prisma, currentUser }) => {

    //   }
    // })

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
