import { prisma } from "../../prisma/generated/prisma-client";
import { get } from "lodash";

const main = async () => {
  const users = await prisma.users();
  users.map(async (user) => {
    const id = get(user, "id");
    var pushToken = get(user, "pushToken");
    if (pushToken !== undefined) {
      await prisma.updateUser({
        data: {
          pushToken: null,
        },
        where: {
          id,
        },
      });
    }
  });
};

main();
