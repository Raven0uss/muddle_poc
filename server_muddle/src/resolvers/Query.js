import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { flattenDeep, isNil, get, isEmpty } from "lodash";

import { prismaObjectType } from "nexus-prisma";
import { idArg, intArg, stringArg } from "nexus/dist";

import filterHomeDebates from "../algorithms/filterHomeDebates";
import moment from "moment";

// Queries
const exposedQueries = {
  adQueries: ["ad", "ads"],
  adTargetQueries: ["adTarget", "adTargets"],
  commentQueries: ["comment", "comments"],
  connectedQueries: ["connecteds"],
  conversationQueries: ["conversation", "conversations"],
  interactionQueries: ["interaction", "interactions"],
  debateQueries: ["debate", "debates"],
  messageQueries: ["message", "messages"],
  notificationQueries: ["notification", "notifications"],
  reportQueries: ["report", "reports"],
  statistiqueQueries: ["statistiques"],
  trophyQueries: ["trophy", "trophies"],
  userQueries: ["users", "user"],
  tmpUserQueries: ["tmpUsers", "tmpUser"],
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
  crowned
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
          // console.log(user);

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

          var m = moment().utcOffset(0);
          m.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
          m.toISOString();
          m.format();

          const today = m;

          const getDate = await prisma.connecteds({
            where: {
              date: new Date(m),
            },
          });

          if (isEmpty(getDate)) {
            await prisma.createConnected({
              date: today,
              connections: {
                connect: {
                  id: user.id,
                },
              },
            });
          } else {
            const users = await prisma
              .connected({ id: getDate[0].id })
              .connections();
            console.log(users);
            if (isNil(users)) throw new Error("error");
            if (
              users.findIndex((u) => {
                u.id === user.id;
              }) === -1
            ) {
              await prisma.updateConnected({
                where: { id: getDate[0].id },
                data: {
                  connections: {
                    connect: {
                      email: "userA",
                    },
                  },
                },
              });
            }
          }

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
        // console.log(user);
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

    t.field("mainStats", {
      type: "MainStats",
      resolve: async (parent, args, { prisma }) => {
        try {
          const debates = await prisma.debates();
          const comments = await prisma.comments();

          const users = await prisma.users();
          const nbUsers = users.length;

          const malePercentage = Math.round(
            (users.filter((u) => u.gender === "MALE").length / nbUsers) * 100
          );
          const femalePercentage = Math.round(
            (users.filter((u) => u.gender === "FEMALE").length / nbUsers) * 100
          );
          const notDefinedPercentage = Math.round(
            (users.filter((u) => u.gender === "NO_INDICATION").length /
              nbUsers) *
              100
          );

          const ageAverage = (() => {
            let average = 0;
            users.map((u) => {
              if (u.role !== "STANDARD") return;
              const birthdate = u.birthdate;
              const age = moment.duration(moment().diff(birthdate)).years();
              if (isNil(age) || age <= 0 || age >= 100) return;
              average = (average + age) / 2;
            });
            return Math.round(average);
          })();

          let connectedToday = 0;

          var m = moment();
          m.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
          m.toISOString();
          m.format();

          const today = m;

          const getDate = await prisma.connecteds({
            where: {
              date: new Date(m),
            },
          });

          if (isEmpty(getDate) === false) {
            const connections = await prisma
              .connected({ id: getDate[0].id })
              .connections();
            connectedToday = connections.length;
          }

          return {
            debates: debates.length,
            comments: comments.length,
            malePercentage,
            femalePercentage,
            notDefinedPercentage,
            ageAverage,
            connectedToday,
          };
        } catch (err) {
          throw new Error(err);
        }
      },
    });

    t.field("accountStats", {
      type: "AccountStats",
      resolve: async (parent, args, { prisma }) => {
        try {
          const users = await prisma.users();
          const certified = users.filter((u) => u.certified);

          let crowns = 0;

          const statistiques = await prisma.statistiques();
          if (isEmpty(statistiques) === false) {
            crowns = statistiques[0].crowns;
          }

          return {
            accounts: users.length,
            certified: certified.length,
            crowns,
          };
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
