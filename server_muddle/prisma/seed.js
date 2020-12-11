const faker = require("faker");
const bcrypt = require("bcrypt");
const { prisma } = require("../generated/prisma-client");
const { userProfile } = require("./images");

function shuffleArray(originArray) {
  const array = [...originArray];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const randomUserList = ({ rejectList = [], users, minimum = 0 }) => {
  const end = minimum + faker.random.number(9 - minimum);
  const start = faker.random.number(0);

  return shuffleArray(users)
    .slice(start, end)
    .map((u) => ({ id: u.id }));
};

const getRandomComments = (nb, { users, debate, subComment = false }) => {
  const comments = [];
  if (subComment)
    for (let index = 0; index < nb; index++) {
      comments.push({
        from: { connect: { id: users[faker.random.number(9)].id } },
        content: faker.lorem.sentence(faker.random.number(50)),
        debate: { connect: { id: debate.id } },
        nested: true,
      });
    }
  else
    for (let index = 0; index < nb; index++) {
      comments.push({
        from: { connect: { id: users[faker.random.number(9)].id } },
        content: faker.lorem.sentence(faker.random.number(50)),
      });
    }
  return comments;
};

async function main() {
  // Create random users
  for (let index = 0; index < 10; index++) {
    const imageRandom = userProfile[faker.random.number(11)];
    await prisma.createUser({
      email: faker.internet.email(),
      password: bcrypt.hashSync("test", 12),
      pseudo: faker.internet.userName(),
      birthdate: faker.date.past(),
      profilePicture: imageRandom,
    });
  }

  const users = await prisma.users();

  //   Create random debates
  // Standard Debate
  for (let index = 0; index < 10; index++) {
    const owner = users[faker.random.number(9)];
    await prisma.createDebate({
      owner: { connect: { id: owner.id } },
      content: `${index} - ${faker.lorem.paragraph()}`,
      type: "STANDARD",
      positives: { connect: randomUserList({ users }) },
      negatives: { connect: randomUserList({ users }) },
      answerOne: "Je suis pour",
      answerTwo: "Je suis contre",
    });
  }

  // Duo Debate
  for (let index = 0; index < 5; index++) {
    const fakeIndex = faker.random.number(8);
    await prisma.createDebate({
      ownerBlue: { connect: { id: users[fakeIndex].id } },
      ownerRed: { connect: { id: users[fakeIndex + 1].id } },
      content: faker.lorem.paragraph(),
      type: "DUO",
      blueVotes: { connect: randomUserList({ users }) },
      redVotes: { connect: randomUserList({ users }) },
      answerOne: "Je suis pour",
      answerTwo: "Je suis contre",
    });
  }

  const standardDebates = await prisma.debates({ where: { type: "STANDARD" } });
  const duoDebates = await prisma.debates({ where: { type: "DUO" } });

  for (let index = 0; index < standardDebates.length; index++) {
    // const dice = faker.random.number(9) % 3 === 0;
    const fakeIndex = faker.random.number(9);
    const debate = standardDebates[index];
    // if (dice) {
    await prisma.updateDebate({
      where: { id: debate.id },
      data: {
        comments: {
          create: getRandomComments(faker.random.number(5) + 1, { users }),
        },
      },
    });
    // }
  }

  const comments = await prisma.comments();
  // Creare sub comment
  await prisma.updateComment({
    where: { id: comments[0].id },
    data: {
      comments: {
        create: getRandomComments(faker.random.number(5) + 1, {
          users,
          debate: standardDebates[0],
          subComment: true,
        }),
      },
    },
  });

  // Create muddle account
  const M = await prisma.createUser({
    email: "appmuddle@appmuddle.muddle",
    password: bcrypt.hashSync("test", 12),
    pseudo: "Muddle",
    birthdate: faker.date.past(),
    role: "MUDDLE",
    profilePicture:
      "https://cdn.image4.io/muddles/f_auto/541fcf81-ff63-407e-a39f-88f1cf7f1ddf.png",
  });

  // Create muddle debates
  for (let index = 0; index < 10; index++) {
    await prisma.createDebate({
      owner: { connect: { pseudo: "Muddle" } },
      content: faker.lorem.paragraph(),
      type: "MUDDLE",
      answerOne: "Je suis pour",
      answerTwo: "Je suis contre",
    });
  }

  // Create two users to test the chat

  const A = await prisma.createUser({
    email: "userA@appmuddle.fr",
    password: bcrypt.hashSync("test", 12),
    pseudo: "userA",
    birthdate: faker.date.past(),
    followers: { connect: randomUserList({ users }) },
    following: { connect: randomUserList({ users }) },
    profilePicture:
      "https://cdn.image4.io/muddles/f_auto/ed428672-8299-4011-b5cc-7512cde89f6c.jpg",
  });

  const B = await prisma.createUser({
    email: "userB@appmuddle.fr",
    password: bcrypt.hashSync("test", 12),
    pseudo: "userB",
    birthdate: faker.date.past(),
    followers: { connect: randomUserList({ users }) },
    following: { connect: randomUserList({ users }) },
    profilePicture:
      "https://cdn.image4.io/muddles/f_auto/ed428672-8299-4011-b5cc-7512cde89f6c.jpg",
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

  // Create all type of notifications
  await prisma.createNotification({
    who: { connect: [{ pseudo: "userA" }] },
    type: "VOTE",
    status: "INFORMATION",
    new: true,
    debate: { connect: { id: standardDebates[0].id } },
  });

  await prisma.createNotification({
    who: { connect: [{ pseudo: "userA" }] },
    type: "INVITATION_DUO",
    status: "PENDING",
    new: true,
    debate: { connect: { id: duoDebates[0].id } },
  });

  await prisma.createNotification({
    who: { connect: [{ pseudo: "userA" }, { pseudo: "userB" }] },
    type: "COMMENT",
    status: "INFORMATION",
    new: false,
    debate: { connect: { id: standardDebates[0].id } },
  });

  await prisma.createNotification({
    who: { connect: [{ pseudo: "userA" }] },
    type: "CLOSE_DEBATE",
    status: "PENDING",
    new: false,
    debate: { connect: { id: standardDebates[0].id } },
  });

  await prisma.createNotification({
    who: { connect: [{ pseudo: "userA" }] },
    type: "LIKE",
    status: "INFORMATION",
    new: false,
    comment: { connect: { id: comments[0].id } },
  });

  await prisma.createNotification({
    who: { connect: [{ pseudo: "userA" }, { pseudo: "userB" }] },
    type: "DISLIKE",
    status: "INFORMATION",
    new: false,
    comment: { connect: { id: comments[0].id } },
  });

  await prisma.createNotification({
    who: { connect: [{ pseudo: "userA" }] },
    type: "REJECT_DUO",
    status: "INFORMATION",
    new: false,
  });

  await prisma.createNotification({
    who: { connect: [{ pseudo: "userA" }] },
    type: "ACCEPT_DUO",
    status: "INFORMATION",
    new: false,
    debate: { connect: { id: duoDebates[0].id } },
  });

  await prisma.createNotification({
    who: { connect: [{ pseudo: "userA" }] },
    type: "ACCEPT_CLOSE_DEBATE",
    status: "INFORMATION",
    new: false,
    debate: { connect: { id: standardDebates[0].id } },
  });

  await prisma.createNotification({
    who: { connect: [{ pseudo: "userA" }] },
    type: "REJECT_CLOSE_DEBATE",
    status: "INFORMATION",
    new: false,
    debate: { connect: { id: standardDebates[0].id } },
  });

  // Trophies

  for (let index = 0; index < 7; index++) {
    if (index % 2 === 0)
      await prisma.createTrophy({
        user: { connect: { pseudo: "userA" } },
        won: true,
        type: "DUO",
        debate: { connect: { id: duoDebates[0].id } },
      });
    else {
      await prisma.createTrophy({
        user: { connect: { pseudo: "userA" } },
        won: true,
        type: "TOP_COMMENT",
        // debate: { connect: { id: comments[0].debate.id } },
        comment: { connect: { id: comments[0].id } },
      });
    }
  }

  // Interactions
  await prisma.createInteraction({
    who: { connect: { pseudo: "userA" } },
    type: "LIKE",
    comment: { connect: { id: comments[0].id } },
  });

  await prisma.createInteraction({
    who: { connect: { pseudo: "userA" } },
    type: "DISLIKE",
    comment: { connect: { id: comments[0].id } },
  });

  await prisma.createInteraction({
    who: { connect: { pseudo: "userA" } },
    type: "COMMENT",
    comment: { connect: { id: comments[0].id } },
  });

  await prisma.createInteraction({
    who: { connect: { pseudo: "userA" } },
    type: "BLUE_VOTE",
    debate: { connect: { id: duoDebates[0].id } },
  });

  await prisma.createInteraction({
    who: { connect: { pseudo: "userA" } },
    type: "RED_VOTE",
    debate: { connect: { id: duoDebates[0].id } },
  });

  await prisma.createInteraction({
    who: { connect: { pseudo: "userA" } },
    type: "POSITIVE_VOTE",
    debate: { connect: { id: standardDebates[0].id } },
  });

  await prisma.createInteraction({
    who: { connect: { pseudo: "userA" } },
    type: "NEGATIVE_VOTE",
    debate: { connect: { id: standardDebates[0].id } },
  });
}

main().catch(console.error);
