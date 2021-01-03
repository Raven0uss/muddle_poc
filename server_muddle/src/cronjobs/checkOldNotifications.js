import { prisma } from "../../prisma/generated/prisma-client";
import moment from "moment";

const main = async () => {
  const twoWeeks = moment().subtract(2, "weeks");

  const notificationsToDelete = await prisma.notifications({
    where: {
      updatedAt_lt: new Date(twoWeeks),
    },
  });

  moment.locale("fr");

  console.log(`[${moment().format("DD/MM/YYYY - HH:mm:ss")}]`);
  console.log("-----------------------------------");
  console.log(`${notificationsToDelete.length} notifications to delete...`);

  await Promise.all(
    notificationsToDelete.map(
      async (notif) => await prisma.deleteNotification({ id: notif.id })
    )
  );

  console.log("Closing...");
  console.log("Done...");
  console.log("-----------------------------------");
};

main();
