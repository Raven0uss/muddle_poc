import { prisma } from "../../generated/prisma-client";

const main = async () => {
  const now = new Date();

  const debatesToClose = await prisma.debates({
    where: {
      published: true,
      closed: false,
      timelimit_lt: now,
    },
  });

//   console.log(debatesToClose);
  Promise.all(
    debatesToClose.map(
      async (d) =>
        await prisma.updateDebate({
          where: {
            id: d.id,
          },
          data: {
            closed: true,
          },
        })
    )
  );
};

main();
