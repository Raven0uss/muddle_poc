import { prisma } from "../../prisma/generated/prisma-client";
import { get } from "lodash";

const main = async () => {
  const users = await prisma.users();
  users.map(async (user) => {
    const id = get(user, "id");
    var email = get(user, "email");
    if (email !== undefined) {
      email = email.toLowerCase();
      await prisma.updateUser({
        data: {
          email,
        },
        where: {
          id,
        },
      });
    }
  });
};

main();
