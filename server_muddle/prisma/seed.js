const faker = require("faker");
const bcrypt = require("bcrypt");
const { prisma } = require("../generated/prisma-client");

async function main() {
  // Create random users
  for (let index = 0; index < 30; index++) {
    await prisma.createUser({
      email: faker.internet.email(),
      password: bcrypt.hashSync("test", 12),
      pseudo: faker.internet.userName(),
      birthdate: faker.date.past(),
    });
  }

  const users = await prisma.users();

  //   Create random debates
  // Standard Debate
  for (let index = 0; index < 120; index++) {
    await prisma.createDebate({
      owner: { connect: { id: users[faker.random.number(29)].id } },
      content: faker.lorem.paragraph(),
      type: "STANDARD",
    });
  }
  // Duo Debate
  for (let index = 0; index < 25; index++) {
    const fakeIndex = faker.random.number(28);
    await prisma.createDebate({
      ownerBlue: { connect: { id: users[fakeIndex].id } },
      ownerRed: { connect: { id: users[fakeIndex + 1].id } },
      content: faker.lorem.paragraph(),
      type: "DUO",
    });
  }

  // Create muddle account
  const M = await prisma.createUser({
    email: "appmuddle@appmuddle.muddle",
    password: bcrypt.hashSync("test", 12),
    pseudo: "Muddle",
    birthdate: faker.date.past(),
    role: "MUDDLE",
  });

  // Create muddle debates
  for (let index = 0; index < 10; index++) {
    await prisma.createDebate({
      owner: { connect: { pseudo: "Muddle" } },
      content: faker.lorem.paragraph(),
      type: "STANDARD",
    });
  }

  // Create two users to test the chat

  const A = await prisma.createUser({
    email: "userA@appmuddle.fr",
    password: bcrypt.hashSync("test", 12),
    pseudo: "userA",
    birthdate: faker.date.past(),
  });

  const B = await prisma.createUser({
    email: "userB@appmuddle.fr",
    password: bcrypt.hashSync("test", 12),
    pseudo: "userB",
    birthdate: faker.date.past(),
  });

  const conversation = await prisma.createConversation({
    speakers: { connect: [{ pseudo: "userA" }, { pseudo: "userB" }] },
  });

  //   Create random messages
  for (let index = 0; index < 45; index++) {
    const dice = faker.random.number(8) % 2 === 0;
    await prisma.createMessage({
      content: faker.lorem.sentence(),
      to: { connect: { pseudo: dice ? "userA" : "userB" } },
      from: { connect: { pseudo: dice ? "userB" : "userA" } },
      conversation: { connect: { id: conversation.id } },
    });
  }
}

main().catch(console.error);
