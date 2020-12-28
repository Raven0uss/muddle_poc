import { prisma } from "../../generated/prisma-client";
import moment from "moment";

const main = async () => {
  const oneWeek = moment().subtract(1, "week");

  const debatesToDelete = await prisma.debates({
    where: {
      updatedAt_lt: new Date(oneWeek),
      published: false
    },
  });

  moment.locale("fr");

  console.log(`[${moment().format("DD/MM/YYYY - HH:mm:ss")}]`);
  console.log("-----------------------------------");
  console.log(`${debatesToDelete.length} unpublished debates to delete...`);

  await Promise.all(
    debatesToDelete.map(
      async (debate) => {
        const debateId = debate.id
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

          return await prisma.deleteDebate({ id: debateId });
      }
    )
  );

  console.log("Closing...");
  console.log("Done...");
  console.log("-----------------------------------");
};

main();
