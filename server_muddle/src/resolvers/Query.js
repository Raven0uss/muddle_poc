import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { flattenDeep, isNil, get } from "lodash";

import { prismaObjectType, makePrismaSchema } from "nexus-prisma";
import { combineResolvers } from "graphql-resolvers";
import { idArg, intArg, stringArg } from "nexus/dist";

import filterHomeDebates from "../algorithms/filterHomeDebates";
import moment from "moment";

// Queries
const exposedQueries = {
  adQueries: ["ad", "ads"],
  adTargetQueries: ["adTarget", "adTargets"],
  commentQueries: ["comment", "comments"],
  conversationQueries: ["conversation", "conversations"],
  interactionQueries: ["interaction", "interactions"],
  debateQueries: ["debate", "debates"],
  messageQueries: ["message", "messages"],
  notificationQueries: ["notification", "notifications"],
  reportQueries: ["report", "reports"],
  trophyQueries: ["trophy", "trophies"],
  userQueries: ["users", "user"],
};

// Fragments
const fragBestDebates = `
fragment BestDebate on Debate {
  id
  content
  answerOne
  answerTwo
  image
  type
  owner {
    id
    certified
    firstname
    lastname
    email
    profilePicture
    private
    role
    followers {
      id
    }
  }
  ownerBlue {
    id
    certified
    firstname
    lastname
    email
    profilePicture
    private
    role
    followers {
      id
    }
  }
  ownerRed {
    id
    certified
    firstname
    lastname
    email
    profilePicture
    role
    private
    followers {
      id
    }
  }
  positives {
    id
  }
  negatives {
    id
  }
  redVotes {
    id
  }
  blueVotes {
    id
  }
  comments {
    id
  }
  createdAt
  updatedAt
  closed
}
`;

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
          // console.log(user);
          const passwordMatch = bcrypt.compareSync(password, user.password);

          // console.log(password);
          if (!passwordMatch) {
            throw new Error("Invalid credentials");
          }

          const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY);

          return { token };
        } catch (error) {
          throw new Error(error);
        }
      },
    });

    // currentUser
    t.field("currentUser", {
      type: "User",
      args: {},
      resolve: async (parent, args, { prisma, currentUser }) => {
        // console.log(currentUser);
        const user = await prisma.user({ id: currentUser.user.id });
        console.log(user);
        return user;
      },
    });

    t.field("newNotifications", {
      type: "NewNotifications",
      resolve: async (parent, args, { prisma, currentUser }) => {
        // console.log(currentUser);
        try {
          const notifications = await prisma.notifications({
            where: {
              userId: currentUser.user.id,
              new: true,
            },
          });
          const conversations = await prisma
            .conversations({
              where: {
                speakers_some: { id: currentUser.user.id },
              },
            })
            .messages({
              where: {
                to: {
                  id: currentUser.user.id,
                },
                read: false,
              },
            }).$fragment(`
          fragment GetFromMessage on Message
          { 
            id
            from {
              id
            }
          }`);

          const blockedList = await prisma
            .user({ id: currentUser.user.id })
            .blocked();
          const messages = get(conversations, "[0].messages");
          if (messages === undefined) throw new Error("messages is undefined");
          // messages.filter((m) => {
          //   const index = blockedList.findIndex((b) => b.id === m.from.id);
          //   console.log(index);
          // });

          const numberOfNewNotifications = notifications.length;
          const numberOfNewMessages = messages.filter(
            (m) => blockedList.findIndex((b) => b.id === m.from.id) === -1
          ).length;
          return {
            notifications: numberOfNewNotifications,
            messages: numberOfNewMessages,
          };
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.list.field("homeDebates", {
      type: "Debate",
      args: {
        skip: intArg(),
        first: intArg(),
      },
      resolve: async (parent, { skip, first }, { prisma, currentUser }) => {
        try {
          const debates = await prisma
            .debates({ orderBy: "updatedAt_DESC", where: { published: true } })
            .$fragment(fragBestDebates);
          const following = await prisma
            .user({ id: currentUser.user.id })
            .following();

          const sorted = filterHomeDebates({
            debates,
            following,
          });

          const skipProps = isNil(skip) ? 0 : skip;
          const firstProps = isNil(first) ? 0 : first;
          if (firstProps === 0) return sorted.slice(skipProps);
          return sorted.slice(skipProps, skipProps + firstProps);
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.list.field("myDebates", {
      type: "Debate",
      args: {
        skip: intArg(),
        first: intArg(),
      },
      resolve: async (parent, { first, skip }, { prisma, currentUser }) => {
        try {
          const myDebates = await (async () => {
            const standard = await prisma
              .user({ id: currentUser.user.id })
              .debates({ where: { published: true } });
            const blue = await prisma
              .user({ id: currentUser.user.id })
              .debatesBlue({ where: { published: true } });
            const red = await prisma
              .user({ id: currentUser.user.id })
              .debatesRed({ where: { published: true } });
            // console.log(standard);
            return [
              ...(isNil(standard) ? [] : standard),
              ...(isNil(blue) ? [] : blue),
              ...(isNil(red) ? [] : red),
            ];
          })();
          const sorted = myDebates.sort((a, b) =>
            moment(b.updatedAt).isBefore(a.updatedAt) ? -1 : 1
          );

          const skipProps = isNil(skip) ? 0 : skip;
          const firstProps = isNil(first) ? 0 : first;
          if (firstProps === 0) return sorted.slice(skipProps);
          return sorted.slice(skipProps, skipProps + firstProps);
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.list.field("ownerDebates", {
      type: "Debate",
      args: {
        skip: intArg(),
        first: intArg(),
        userId: idArg(),
      },
      resolve: async (parent, { first, skip, userId }, { prisma }) => {
        try {
          const myDebates = await (async () => {
            const standard = await prisma
              .user({ id: userId })
              .debates({ where: { published: true } });
            const blue = await prisma
              .user({ id: userId })
              .debatesBlue({ where: { published: true } });
            const red = await prisma
              .user({ id: userId })
              .debatesRed({ where: { published: true } });
            // console.log(standard);
            return [
              ...(isNil(standard) ? [] : standard),
              ...(isNil(blue) ? [] : blue),
              ...(isNil(red) ? [] : red),
            ];
          })();
          const sorted = myDebates.sort((a, b) =>
            moment(b.updatedAt).isBefore(a.updatedAt) ? -1 : 1
          );

          const skipProps = isNil(skip) ? 0 : skip;
          const firstProps = isNil(first) ? 0 : first;
          if (firstProps === 0) return sorted.slice(skipProps);
          return sorted.slice(skipProps, skipProps + firstProps);
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.list.field("bestDebates", {
      type: "Debate",
      args: {
        first: intArg(),
        skip: intArg(),
      },
      resolve: async (parent, { first, skip }, { prisma }) => {
        try {
          const debates = await prisma
            .debates({ orderBy: "updatedAt_DESC", where: { published: true } })
            .$fragment(fragBestDebates);
          if (isNil(debates)) return [];
          const bestDebates = debates.sort((a, b) => {
            const aPopularity =
              a.positives.length +
              a.negatives.length +
              a.redVotes.length +
              a.blueVotes.length +
              a.comments.length;
            const bPopularity =
              b.positives.length +
              b.negatives.length +
              b.redVotes.length +
              b.blueVotes.length +
              b.comments.length;

            return bPopularity - aPopularity;
          });

          const skipProps = isNil(skip) ? 0 : skip;
          const firstProps = isNil(first) ? 0 : first;
          if (firstProps === 0) return bestDebates.slice(skipProps);
          return bestDebates.slice(skipProps, skipProps + firstProps);
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    // trophies
    // t.list.field("trophies", {
    //   type: "Trophy",
    //   args: {},
    //   resolve: async (parent, args, { prisma }) => {
    //     const trophies = await prisma.trophys();
    //     return trophies;
    //   },
    // });
  },
});

export default Query;
