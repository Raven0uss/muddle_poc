import { prisma } from "../../generated/prisma-client";
import moment from "moment";

const main = async () => {
  const oneDay = moment().subtract(1, "day");

  const userToRemoveCrown = await prisma.users({
    where: {
      crownedDate_lt: new Date(oneDay),
    },
  });

  moment.locale("fr");

  console.log(`[${moment().format("DD/MM/YYYY - HH:mm:ss")}]`);
  console.log("-----------------------------------");
  console.log(`${userToRemoveCrown.length} users to remove crown...`);

  await Promise.all(
    userToRemoveCrown.map(
      async (user) =>
        await prisma.updateUser({
          where: { id: user.id },
          data: {
            crowned: false,
            crownedDate: null,
          },
        })
    )
  );

  console.log("Closing...");
  console.log("Done...");
  console.log("-----------------------------------");
};

main();
