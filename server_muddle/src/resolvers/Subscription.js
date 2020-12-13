import { subscriptionField, stringArg } from "nexus/dist";

const Subscription = {
  // message sub
  messageSubscription: subscriptionField("message", {
    type: "MessageSubPayload",
    subscribe: (parent, args, { prisma }) => {
      return prisma.$subscribe.message({ mutation_in: "CREATED" });
    },
    resolve: (payload) => payload,
  }),

  // comment sub
  commentSubscription: subscriptionField("comment", {
    type: "CommentSubPayload",
    args: {
      debateId: stringArg(),
    },
    subscribe: (parent, args, { prisma }) => {
      const { debateId } = args;
      console.log(debateId);
      return prisma.$subscribe.comment({
        mutation_in: "CREATED",
        node: {
          debate: {
            id: debateId,
          },
        },
      });
    },
    resolve: (payload) => payload,
  }),

  // notification sub
  notificationSubscription: subscriptionField("notification", {
    type: "NotificationSubPayload",
    subscribe: (parent, args, { prisma }) => {
      return prisma.$subscribe.notification({ mutation_in: "CREATED" });
    },
    resolve: (payload) => payload,
  }),
};

export default Subscription;
