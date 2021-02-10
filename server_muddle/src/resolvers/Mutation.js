import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { flattenDeep, get, isEmpty, isNil } from "lodash";

import { prismaObjectType } from "nexus-prisma";
import { booleanArg, idArg, stringArg } from "nexus/dist";
import { dateArg } from "./Types";

import timelimitToDateTime from "../algorithms/timelimitToDateTime";
import { sendMailNoReplyWithHeaderAndFooter } from "../mail/index";

import moment from "moment";
import { sendPushNotification } from "../pushNotifications";
import getPushNotificationObject from "../pushNotifications/messagesNotifications";
import html_validationAccount from "../mail/html/validationAccount";
import html_forgotPassword from "../mail/html/forgotPassword";

// Mutations
const exposedMutations = {
  adMutations: ["createAd", "updateAd", "deleteAd"],
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
  reportMutations: ["createReport", "updateReport", "deleteReport"],
  trophyMutations: ["createTrophy", "updateTrophy"],
  userMutations: ["updateUser"],
  tmpUserMutations: ["createTmpUser"],
};

const fragmentGetAllComments = `
  fragment GetAllComments on Debate  {
    id
    content
    comments {
      id
      content
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
    content
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
    content
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
    content
    from {
      id
    }
  }
`;

const Mutation = prismaObjectType({
  name: "Mutation",
  definition(t) {
    t.prismaFields(flattenDeep(Object.values(exposedMutations).map((m) => m)));

    // testSendMail
    t.field("sendMail", {
      type: "NoValue",
      args: {},
      resolve: async (parent, args, ctx) => {
        try {
          const html = `<p>wesh alors</p>`;
          const mailResponse = await sendMailNoReplyWithHeaderAndFooter(
            "pro.muddles@gmail.com", // user mail
            "Wesh alors", // to change oc
            html
          );
          console.log(mailResponse);
          return { value: 0 };
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    // signUp
    t.field("signUp", {
      type: "Token",
      args: {
        email: stringArg(),
        password: stringArg(),
        firstname: stringArg(),
        lastname: stringArg(),
        birthdate: dateArg(),
        gender: stringArg(),
      },
      resolve: async (
        parent,
        { email, password, firstname, lastname, birthdate, gender },
        { prisma }
      ) => {
        try {
          const checkUserBanned = await prisma.banUser({ email });
          if (!isNil(checkUserBanned)) throw new Error("User banned.");

          const hashedPassword = bcrypt.hashSync(password, 12);
          const checkUserExist = await prisma.user({ email });
          if (!isNil(checkUserExist)) throw new Error("User already member.");

          const checkTmpUserExist = await prisma.tmpUser({ email });
          if (!isNil(checkTmpUserExist))
            throw new Error("Tmp User already member.");

          let getGender = gender;
          if (
            gender !== "FEMALE" &&
            gender !== "MALE" &&
            gender !== "NO_INDICATION"
          )
            getGender = "NO_INDICATION";
          const user = await prisma.createTmpUser({
            email,
            password: hashedPassword,
            firstname,
            lastname,
            birthdate,
            gender: getGender,
          });

          const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
            expiresIn: 43200,
          });

          // Send email here with token link
          // const html = `<p>${token}</p>`;
          // const mailResponse = await sendMailNoReplyWithHeaderAndFooter(
          //   email, // user mail
          //   "Validation token", // to change oc
          //   html,
          //   null // attachments, nullable ?
          // );

          const html = html_validationAccount({
            firstname,
            lastname,
            token,
          });

          await sendMailNoReplyWithHeaderAndFooter(
            email,
            "Validation de mon compte", // to change oc
            html
          );

          return { token };
        } catch (error) {
          throw new Error(error);
        }
      },
    });

    // Create a field to check email only ?

    t.field("validateUser", {
      type: "User",
      args: {
        token: stringArg(),
      },
      resolve: async (parent, { token }, { prisma }) => {
        try {
          const decodedUser = get(
            jwt.decode(token, process.env.JWT_SECRET_KEY),
            "user"
          );
          if (isNil(decodedUser)) throw new Error("Not a good token");
          if (
            "email" in decodedUser &&
            "password" in decodedUser &&
            "firstname" in decodedUser &&
            "lastname" in decodedUser &&
            "birthdate" in decodedUser &&
            "gender" in decodedUser
          ) {
            const user = await prisma.user({ email: decodedUser.email });
            if (!isNil(user)) {
              throw new Error("User already validate");
            }
            const tmpUser = await prisma.tmpUser({ email: decodedUser.email });
            if (isNil(tmpUser) || get(tmpUser, "id") === undefined) {
              throw new Error("Not a good token");
            }
            const validateUser = await prisma.createUser({
              email: decodedUser.email,
              password: decodedUser.password,
              firstname: decodedUser.firstname,
              lastname: decodedUser.lastname,
              birthdate: decodedUser.birthdate,
              gender: decodedUser.gender,
            });
            await prisma.deleteTmpUser({ id: tmpUser.id });
            return validateUser;
          } else throw new Error("Not a good token");
        } catch (error) {
          throw new Error(error);
        }
      },
    });

    t.field("forgotPassword", {
      type: "Token",
      args: {
        email: stringArg(),
      },
      resolve: async (parent, { email }, { prisma }) => {
        try {
          const user = await prisma.user({ email });
          if (isNil(user)) throw new Error("invalid user");

          const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
            expiresIn: 7200,
          });

          // send forgot mail here
          const html = html_forgotPassword({
            token,
          });

          await sendMailNoReplyWithHeaderAndFooter(
            email,
            "Oubli de mon mot de passe", // to change oc
            html
          );

          console.log(token);

          return { token };
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("checkTokenForgotPassword", {
      type: "User",
      args: {
        token: stringArg(),
      },
      resolve: async (parent, { token }, { prisma }) => {
        try {
          const user = await jwt.decode(token, process.env.JWT_SECRET_KEY);
          if (isNil(user)) return { id: 0, email: "" };

          if (Date.now() >= user.exp * 7200) {
            return { id: 0, email: "" };
          }
          const userQuery = await prisma.user({ id: user.user.id });
          return { id: userQuery.id, email: userQuery.email };
        } catch (err) {
          console.error(err);
          return { id: 0, email: "" };
        }
      },
    });

    t.field("createNewUser", {
      type: "User",
      args: {
        email: stringArg(),
        password: stringArg(),
        firstname: stringArg(),
        lastname: stringArg(),
        birthdate: dateArg(),
        gender: stringArg(),
        role: stringArg(),
        certified: booleanArg(),
        private: booleanArg(),
        profilePicture: stringArg(),
        coverPicture: stringArg(),
      },
      resolve: async (parent, args, { prisma }) => {
        try {
          const checkUserBanned = await prisma.banUser({ email: args.email });
          if (!isNil(checkUserBanned)) throw new Error("User banned.");

          const hashedPassword = bcrypt.hashSync(password, 12);

          const user = await prisma.createUser({
            email: args.email,
            password: hashedPassword,
            firstname: args.firstname,
            lastname: args.lastname,
            birthdate: args.birthdate,
            gender: args.gender,
            role: args.role,
            certified: args.certified,
            private: args.certified,
          });
          if (
            isEmpty(args.profilePicture) === false &&
            isNil(args.profilePicture) === false
          ) {
            await prisma.updateUser({
              where: { id: user.id },
              data: {
                profilePicture: args.profilePicture,
              },
            });
          }
          if (
            isEmpty(args.coverPicture) === false &&
            isNil(args.coverPicture) === false
          ) {
            await prisma.updateUser({
              where: { id: user.id },
              data: {
                coverPicture: args.coverPicture,
              },
            });
          }
          return user;
        } catch (err) {
          throw new Error(err);
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

          const userObject = await prisma.user({ id: user });

          sendPushNotification(
            getPushNotificationObject({
              pushToken: userObject.pushToken,
              type: "invitationDuo",
              language: userObject.language,
              user: `${currentUser.user.firstname} ${
                currentUser.user.lastname
              }`,
            })
          );

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
            await prisma.createNotification({
              who: { connect: { id: winnerId } },
              userId: winnerId,
              type: "WON_DEBATE",
              status: "INFORMATION",
              new: true,
              debate: { connect: { id: debate.id } },
            });

            const winner = await prisma.user({ id: winnerId });

            sendPushNotification(
              getPushNotificationObject({
                pushToken: winner.pushToken,
                type: "wonDebateDuo",
                language: winner.language,
              })
            );
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
            await prisma.createNotification({
              who: { connect: { id: topCommentId.user } },
              userId: topCommentId.user,
              type: "TOP_COMMENT",
              status: "INFORMATION",
              new: true,
              comment: { connect: { id: topCommentId.comment } },
            });

            const topCommentUser = await prisma.user({ id: topCommentId.user });

            sendPushNotification(
              getPushNotificationObject({
                pushToken: topCommentUser.pushToken,
                type: "wonDebateComment",
                language: topCommentUser.language,
              })
            );
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

          const user = await prisma.user({
            id: userId,
          });

          sendPushNotification(
            getPushNotificationObject({
              pushToken: user.pushToken,
              type: "closeDebate",
              language: user.language,
              debate: debate.content,
              user: `${currentUser.user.firstname} ${
                currentUser.user.lastname
              }`,
            })
          );

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

          const user = await prisma.user({ id: userId });
          sendPushNotification(
            getPushNotificationObject({
              pushToken: user.pushToken,
              type: "deleteDebate",
              language: user.language,
              debate: debate.content,
              user: `${currentUser.user.firstname} ${
                currentUser.user.lastname
              }`,
            })
          );

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

          const user = await prisma.user({ id: comment.from.id });
          sendPushNotification(
            getPushNotificationObject({
              pushToken: user.pushToken,
              type: "like",
              language: user.language,
              comment: comment.content,
              user: `${currentUser.user.firstname} ${
                currentUser.user.lastname
              }`,
            })
          );

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

          const user = await prisma.user({ id: comment.from.id });
          sendPushNotification(
            getPushNotificationObject({
              pushToken: user.pushToken,
              type: "dislike",
              language: user.language,
              comment: comment.content,
              user: `${currentUser.user.firstname} ${
                currentUser.user.lastname
              }`,
            })
          );

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

            const owner = await prisma.user({ id: debate.owner.id });
            sendPushNotification(
              getPushNotificationObject({
                pushToken: owner.pushToken,
                type: "vote",
                language: owner.language,
                debate: debate.content,
                user: `${currentUser.user.firstname} ${
                  currentUser.user.lastname
                }`,
              })
            );
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

              const ownerRed = await prisma.user({ id: debate.ownerRed.id });
              const ownerBlue = await prisma.user({ id: debate.ownerBlue.id });
              sendPushNotification(
                getPushNotificationObject({
                  pushToken: ownerRed.pushToken,
                  type: "vote",
                  language: ownerRed.language,
                  debate: debate.content,
                  user: `${currentUser.user.firstname} ${
                    currentUser.user.lastname
                  }`,
                })
              );
              sendPushNotification(
                getPushNotificationObject({
                  pushToken: ownerBlue.pushToken,
                  type: "vote",
                  language: ownerBlue.language,
                  debate: debate.content,
                  user: `${currentUser.user.firstname} ${
                    currentUser.user.lastname
                  }`,
                })
              );
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

            const ownerRed = await prisma.user({ id: debate.ownerRed.id });
            const ownerBlue = await prisma.user({ id: debate.ownerBlue.id });

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

              sendPushNotification(
                getPushNotificationObject({
                  pushToken: ownerRed.pushToken,
                  type: "comment",
                  language: ownerRed.language,
                  debate: debate.content,
                  user: `${currentUser.user.firstname} ${
                    currentUser.user.lastname
                  }`,
                })
              );
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
              sendPushNotification(
                getPushNotificationObject({
                  pushToken: ownerBlue.pushToken,
                  type: "comment",
                  language: ownerBlue.language,
                  debate: debate.content,
                  user: `${currentUser.user.firstname} ${
                    currentUser.user.lastname
                  }`,
                })
              );
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
            const owner = await prisma.user({ id: debate.owner.id });
            sendPushNotification(
              getPushNotificationObject({
                pushToken: owner.pushToken,
                type: "comment",
                language: owner.language,
                debate: debate.content,
                user: `${currentUser.user.firstname} ${
                  currentUser.user.lastname
                }`,
              })
            );
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

              const ownerRed = await prisma.user({ id: debate.ownerRed.id });
              sendPushNotification(
                getPushNotificationObject({
                  pushToken: ownerRed.pushToken,
                  type: "comment",
                  language: ownerRed.language,
                  debate: debate.content,
                  user: `${currentUser.user.firstname} ${
                    currentUser.user.lastname
                  }`,
                })
              );
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

              const ownerBlue = await prisma.user({ id: debate.ownerBlue.id });
              sendPushNotification(
                getPushNotificationObject({
                  pushToken: ownerBlue.pushToken,
                  type: "comment",
                  language: ownerBlue.language,
                  debate: debate.content,
                  user: `${currentUser.user.firstname} ${
                    currentUser.user.lastname
                  }`,
                })
              );
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
              const owner = await prisma.user({ id: debate.owner.id });
              sendPushNotification(
                getPushNotificationObject({
                  pushToken: owner.pushToken,
                  type: "comment",
                  language: owner.language,
                  debate: debate.content,
                  user: `${currentUser.user.firstname} ${
                    currentUser.user.lastname
                  }`,
                })
              );
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
            const commentOwner = await prisma.user({ id: comment.from.id });
            sendPushNotification(
              getPushNotificationObject({
                pushToken: commentOwner.pushToken,
                type: "comment",
                language: commentOwner.language,
                comment: comment.content,
                user: `${currentUser.user.firstname} ${
                  currentUser.user.lastname
                }`,
              })
            );
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

          sendPushNotification(
            getPushNotificationObject({
              pushToken: updatedUser.pushToken,
              type: "crown",
              language: updatedUser.language,
            })
          );

          const statistiques = await prisma.statistiques();
          if (isEmpty(statistiques)) {
            const newStatistiques = await prisma.createStatistique({
              crowns: 1,
            });
          } else {
            await prisma.updateStatistique({
              where: { id: statistiques[0].id },
              data: {
                crowns: statistiques[0].crowns + 1,
              },
            });
          }

          return updatedUser;
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("checkEmailSignup", {
      type: "NoValue",
      args: {
        email: stringArg(),
      },
      resolve: async (parent, { email }, { prisma }) => {
        try {
          const user = await prisma.user({ email });
          const isBanned = await prisma.banUser({ email });
          if (isNil(isBanned) === false) return { value: -2 }; // banned
          console.log(user);
          if (isNil(user)) {
            const tmpUser = await prisma.tmpUser({ email });
            console.log(tmpUser);
            if (isNil(tmpUser)) return { value: 0 };
          }
          return { value: -1 }; // -1 already used
        } catch (err) {
          console.error(err);
          return { value: -1 }; // -1 already used
        }
      },
    });

    t.field("checkPasswordOk", {
      type: "NoValue",
      args: {
        userId: idArg(),
        currentPassword: stringArg(),
      },
      resolve: async (parent, { userId, currentPassword }, { prisma }) => {
        try {
          const user = await prisma.user({ id: userId });
          if (isNil(user)) {
            return { value: -1 }; // user doesnt exist
          }
          const userPasswordHash = get(user, "password");
          if (isNil(user)) {
            return { value: -1 }; // user doesnt exist
          }
          if (bcrypt.compareSync(currentPassword, userPasswordHash) === false)
            return { value: -1 };
          return { value: 0 };
        } catch (err) {
          console.log(err);
          return { value: -1 };
        }
      },
    });

    t.field("changePassword", {
      type: "NoValue",
      args: {
        userId: idArg(),
        newPassword: stringArg(),
      },
      resolve: async (parent, { userId, newPassword }, { prisma }) => {
        try {
          const user = await prisma.user({ id: userId });
          if (isNil(user)) {
            return { value: -1 }; // user doesnt exist
          }
          const hashedPassword = bcrypt.hashSync(newPassword, 12);
          const updatedUser = await prisma.updateUser({
            where: {
              id: userId,
            },
            data: {
              password: hashedPassword,
            },
          });
          return { value: 0 };
        } catch (err) {
          console.log(err);
          return { value: -1 };
        }
      },
    });

    t.field("deleteThisUser", {
      type: "NoValue",
      args: {
        userId: idArg(),
        banned: booleanArg(),
      },
      resolve: async (parent, { userId, banned }, { prisma }) => {
        try {
          const user = await prisma.user({ id: userId });
          if (user !== null) {
            const notifications = await prisma
              .user({ id: userId })
              .notifications();
            const trophies = await prisma.user({ id: userId }).trophies();
            const interactions = await prisma
              .user({ id: userId })
              .interactions();
            const conversations = await prisma
              .user({ id: userId })
              .conversations();
            const comments = await prisma.comments({
              where: {
                from: {
                  id: user.id,
                },
              },
            });
            const debatesUser = await prisma.user({ id: userId }).debates();
            const debates = await prisma.debates({
              where: {
                owner: {
                  id: userId,
                },
              },
            });
            const debatesRed = await prisma.debates({
              where: {
                ownerRed: {
                  id: userId,
                },
              },
            });
            const debatesBlue = await prisma.debates({
              where: {
                ownerBlue: {
                  id: userId,
                },
              },
            });

            // Delete Notifications
            notifications.map(async (notification) => {
              await prisma.deleteNotification({ id: notification.id });
            });
            // Delete Trophies
            trophies.map(async (trophy) => {
              await prisma.deleteTrophy({ id: trophy.id });
            });
            // Delete Interactions
            interactions.map(async (interaction) => {
              await prisma.deleteNotification({ id: interaction.id });
            });

            // Delete Conversations
            await Promise.all(
              conversations.map(async (conversation) => {
                const messages = await prisma
                  .conversation({ id: conversation.id })
                  .messages();
                await Promise.all(
                  messages.map(async (message) => {
                    return await prisma.deleteMessage({ id: message.id });
                  })
                );
              })
            );

            conversations.map(async (conversation) => {
              await prisma.deleteConversations({ id: conversation.id });
            });

            // Delete Comments
            comments.map(async (comment) => {
              await prisma.deleteComment({ id: comment.id });
            });

            // Delete Debate
            const allDebates = [
              ...debates,
              ...debatesRed,
              ...debatesBlue,
              ...debatesUser,
            ];

            await Promise.all(
              allDebates.map(async (debate) => {
                const thisDebate = await prisma.debate({ id: debate.id });
                if (thisDebate === null) return;

                const debateComments = await prisma
                  .debate({ id: debate.id })
                  .comments();

                const reports = await prisma.reports({
                  where: {
                    debate: {
                      id: debate.id,
                    },
                  },
                });

                reports.map(async (report) => {
                  await prisma.deleteReport({ id: report.id });
                });

                await Promise.all(
                  debateComments.map(async (comment) => {
                    return await prisma.deleteComment({ id: comment.id });
                  })
                );
              })
            );

            allDebates.map(async (debate) => {
              await prisma.deleteDebate({ id: debate.id });
            });

            if (banned) {
              await prisma.createBanUser({
                email: user.email,
              });
            }
            await prisma.deleteUser({ id: userId });
            return { value: 0 };
          } else {
            return { value: -1 };
          }
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("createGeneratedDebate", {
      type: "Debate",
      args: {
        days: stringArg(),
        hours: stringArg(),
        content: stringArg(),
        image: stringArg(),
        answerOne: stringArg(),
        answerTwo: stringArg(),
      },
      resolve: async (
        parent,
        { days, hours, content, image, answerOne, answerTwo },
        { prisma }
      ) => {
        try {
          const muddleAccount = await prisma.users({
            where: {
              role: "MUDDLE",
            },
          });
          if (isNil(muddleAccount)) throw new Error("error");
          const muddleAccountSelected = muddleAccount[0];
          if (isNil(muddleAccountSelected)) throw new Error("error");

          const duration = moment()
            .add(parseInt(days, 10), "days")
            .add(parseInt(hours, 10), "hours");

          const debate = await prisma.createDebate({
            owner: {
              connect: {
                id: muddleAccountSelected.id,
              },
            },
            timelimit: duration,
            content,
            image: isEmpty(image.replace(/\s/g, "")) ? null : image,
            answerOne,
            answerTwo,
            type: "MUDDLE",
          });
          return debate;
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("signInDashboard", {
      type: "Token",
      args: {
        email: stringArg(),
        password: stringArg(),
      },
      resolve: async (parent, { email, password }, { prisma }) => {
        try {
          const user = await prisma.user({ email });
          // console.log(user);

          console.log(user);
          if (!user) {
            return { token: 0 };
          }
          const passwordMatch = bcrypt.compareSync(password, user.password);

          // console.log(password);
          if (!passwordMatch) {
            return { token: 0 };
          }
          if (user.role !== "ADMIN" && user.role !== "MODERATOR") {
            return { token: 0 };
          }
          const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
          });
          return { token };
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("checkTokenDashboard", {
      type: "User",
      args: {
        token: stringArg(),
      },
      resolve: async (parent, { token }, { prisma }) => {
        try {
          const user = await jwt.decode(token, process.env.JWT_SECRET_KEY);
          if (isNil(user)) return { id: 0, role: "STANDARD" };

          if (Date.now() >= user.exp * 1000) {
            return { id: 0, role: "STANDARD" };
          }
          const userQuery = await prisma.user({ id: user.user.id });
          return userQuery;
        } catch (err) {
          console.error(err);
          return { id: 0, role: "STANDARD" };
        }
      },
    });

    t.field("checkPushToken", {
      type: "User",
      args: {
        pushToken: stringArg(),
        userId: idArg(),
      },
      resolve: async (parent, { pushToken, userId }, { prisma }) => {
        try {
          const user = await prisma.user({ id: userId });
          const currentPushToken = get(user, "pushToken");
          if (currentPushToken !== pushToken) {
            const updatedUser = await prisma.updateUser({
              where: { id: userId },
              data: {
                pushToken,
              },
            });
            return updatedUser;
          } else {
            return user;
          }
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("notifyMessage", {
      type: "NoValue",
      args: {
        userId: idArg(),
        message: stringArg(),
      },
      resolve: async (parent, { userId, message }, { prisma, currentUser }) => {
        try {
          const to = await prisma.user({ id: userId });
          sendPushNotification(
            getPushNotificationObject({
              pushToken: to.pushToken,
              type: "message",
              language: to.language,
              user: `${currentUser.user.firstname} ${
                currentUser.user.lastname
              }`,
              message,
            })
          );
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
