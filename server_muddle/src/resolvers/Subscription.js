import { subscriptionField, stringArg } from "nexus/dist";

const Subscription = {
  // message sub
  messageSubscription: subscriptionField("message", {
    type: "MessageSubPayload",
    args: {
      userId: stringArg(),
      conversationId: stringArg(),
    },
    subscribe: (parent, args, { prisma }) => {
      const { userId, conversationId } = args;
      if (conversationId !== undefined) {
        return prisma.$subscribe.message({
          mutation_in: "CREATED",
          node: {
            conversation: {
              id: conversationId,
            },
          },
        });
      } else {
        return prisma.$subscribe.message({
          mutation_in: "CREATED",
          node: {
            conversation: {
              speakers_some: {
                id: userId,
              },
            },
          },
        });
      }
    },
    resolve: (payload) => payload,
  }),

  // conversation
  conversationSubscription: subscriptionField("conversation", {
    type: "ConversationSubPayload",
    args: {
      userId: stringArg(),
    },
    subscribe: (parent, args, { prisma }) => {
      const { userId } = args;
      return prisma.$subscribe.subscribe({
        mutation_in: "CREATED",
        node: {
          speakers_some: {
            id: userId,
          },
        },
      });
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
      // console.log(debateId);
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
    args: {
      userId: stringArg(),
    },
    subscribe: (parent, args, { prisma }) => {
      const { userId } = args;
      // const user = await prisma.user({ id: userId });
      // console.log(user.email);
      return prisma.$subscribe.notification({
        mutation_in: "CREATED",
        node: {},
      });
    },
    resolve: (payload) => payload,
  }),
};

export default Subscription;
