import { subscriptionField } from "nexus/dist";

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
    subscribe: (parent, args, { prisma }) => {
      return prisma.$subscribe.comment({ mutation_in: "CREATED" });
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