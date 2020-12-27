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
      async (debate) => await prisma.deleteDebate({ id: debate.id })
    )
  );

  console.log("Closing...");
  console.log("Done...");
  console.log("-----------------------------------");
};

main();
