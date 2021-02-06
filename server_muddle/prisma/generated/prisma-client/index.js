"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Ad",
    embedded: false
  },
  {
    name: "GenderFilter",
    embedded: false
  },
  {
    name: "AdTarget",
    embedded: false
  },
  {
    name: "Comment",
    embedded: false
  },
  {
    name: "Conversation",
    embedded: false
  },
  {
    name: "DebateType",
    embedded: false
  },
  {
    name: "Debate",
    embedded: false
  },
  {
    name: "InteractionType",
    embedded: false
  },
  {
    name: "Interaction",
    embedded: false
  },
  {
    name: "Message",
    embedded: false
  },
  {
    name: "NotificationType",
    embedded: false
  },
  {
    name: "NotificationStatus",
    embedded: false
  },
  {
    name: "Notification",
    embedded: false
  },
  {
    name: "ReportType",
    embedded: false
  },
  {
    name: "ReportReason",
    embedded: false
  },
  {
    name: "Report",
    embedded: false
  },
  {
    name: "Connected",
    embedded: false
  },
  {
    name: "Statistique",
    embedded: false
  },
  {
    name: "TrophyType",
    embedded: false
  },
  {
    name: "Trophy",
    embedded: false
  },
  {
    name: "Role",
    embedded: false
  },
  {
    name: "Gender",
    embedded: false
  },
  {
    name: "Theme",
    embedded: false
  },
  {
    name: "Language",
    embedded: false
  },
  {
    name: "MailStatus",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  },
  {
    name: "TmpUser",
    embedded: false
  },
  {
    name: "BanUser",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://52.47.56.241:4466`
});
exports.prisma = new exports.Prisma();
