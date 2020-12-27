const faker = require("faker");
const bcrypt = require("bcrypt");
const { prisma } = require("../generated/prisma-client");
const { userProfile, userCover } = require("./images");

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
    const coverRandom = userCover[faker.random.number(9)];
    await prisma.createUser({
      email: faker.internet.email(),
      password: bcrypt.hashSync("test", 12),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      birthdate: faker.date.past(),
      // certified: true,
      coverPicture: coverRandom,
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
      answerOne: faker.lorem.sentence(faker.random.number(4) + 1, 36),
      answerTwo: faker.lorem.sentence(faker.random.number(4) + 1, 36),
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
      answerOne: faker.lorem.sentence(faker.random.number(4) + 1, 36),
      answerTwo: faker.lorem.sentence(faker.random.number(4) + 1, 36),
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
    firstname: "Muddles",
    lastname: "Team",
    birthdate: faker.date.past(),
    certified: true,
    role: "MUDDLE",
    private: true,
    coverPicture:
      "https://image.freepik.com/vecteurs-libre/fond-texture-blanc-elegant_23-2148431731.jpg",
    profilePicture:
      "https://cdn.image4.io/muddles/f_auto/541fcf81-ff63-407e-a39f-88f1cf7f1ddf.png",
  });

  // Create muddle debates
  for (let index = 0; index < 10; index++) {
    await prisma.createDebate({
      owner: { connect: { email: "appmuddle@appmuddle.muddle" } },
      content: faker.lorem.paragraph(),
      type: "MUDDLE",
      answerOne: faker.lorem.sentence(faker.random.number(4) + 1, 36),
      answerTwo: faker.lorem.sentence(faker.random.number(4) + 1, 36),
    });
  }

  await prisma.createAd({
    name: "coca",
    company: "Coca-Cola",
    companyIcon:
      "https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/08/09/10/coco-cola.jpg",
    content:
      "Coca-Cola, parfois appelé Coca, est une boisson très plus populaire dans le monde fabriquée par la société Coca-Cola. D’abord présentée comme un médicament breveté lorsqu’elle a été formulée par John Pemberton à la fin du XIXe siècle, la boisson a été achetée par l’homme d’affaires Asa Griggs Candler en 1887. C’était Candler qui a fabriqué l’une des plus célèbres boissons de la planète.",
    image: "https://daniellatif.fr/files/2016/01/cocacola-savoure-linstant.jpg",
    ratio: 3,
  });

  await prisma.createAd({
    name: "pringles",
    company: "Pringles",
    link: "http://www.pringles.com",
    companyIcon:
      "https://www.litecom.fr/wp-content/uploads/2020/08/pringle_history.jpg",
    content:
      "Mr Pringle est devenu un symbole du produit. C’était une tête d’homme avec des cheveux, des yeux et des sourcils noirs séparés et une moustache noire touffue. Pour comprendre la signification de ce symbole Pringles, il faut savoir que les Pringles sont des chips. Bien que les chips doivent leur goût à Alexander Liepa, un chercheur de P&G, le personnage caricatural du logo des Pringles ne ressemble pas du tout à l’homme, mais plutôt à une pomme de terre.",
    image:
      "https://i1.wp.com/jai-un-pote-dans-la.com/wp-content/uploads/2020/09/we_are_social_jai_un_pote_dans_la_com-1.jpg",
    ratio: 1,
  });

  await prisma.createAd({
    name: "nike",
    company: "Nike",
    link: "http://www.nike.com",
    companyIcon:
      "https://www.episod.com/wp-content/uploads/2019/04/b2b-logo-nike.jpg",
    content:
      "Qui n’a jamais porter de Nike dans sa vie ? Nike est sans doute la marque la plus connu et la plus appréciée dans l’industrie du sport. Des chaussures aux vêtements, du sport à la mode, de l’accessoire le plus performant à l’accessoire le plus simple, Nike a su se démarquer des autres marques et ainsi perdurer pour devenir une des marques les plus importantes à ce jour.",
    image: "https://mixmag.fr/assets/uploads/images/_facebook/Nike.png",
    ratio: 10,
  });

  // Create two users to test the chat

  const A = await prisma.createUser({
    email: "userA",
    password: bcrypt.hashSync("test", 12),
    firstname: "Elliot",
    lastname: "Alderson",
    birthdate: faker.date.past(),
    coverPicture:
      "https://cdn.image4.io/muddles/f_auto/a0808348-5e78-420e-a724-71e247babb37.jpg",
    followers: { connect: randomUserList({ users }) },
    following: { connect: randomUserList({ users }) },
    profilePicture:
      "https://cdn.image4.io/muddles/f_auto/ed428672-8299-4011-b5cc-7512cde89f6c.jpg",
  });

  const B = await prisma.createUser({
    email: "userB",
    password: bcrypt.hashSync("test", 12),
    firstname: "Mister",
    lastname: "Robot",
    birthdate: faker.date.past(),
    followers: { connect: randomUserList({ users }) },
    following: { connect: randomUserList({ users }) },
    coverPicture:
      "https://cdn.image4.io/muddles/f_auto/a0808348-5e78-420e-a724-71e247babb37.jpg",
    profilePicture:
      "https://cdn.image4.io/muddles/f_auto/ed428672-8299-4011-b5cc-7512cde89f6c.jpg",
  });

  const conversation = await prisma.createConversation({
    speakers: { connect: [{ email: "userA" }, { email: "userB" }] },
  });

  //   Create random messages
  for (let index = 0; index < 15; index++) {
    const dice = faker.random.number(8) % 2 === 0;
    await prisma.createMessage({
      content: faker.lorem.sentence(),
      to: { connect: { email: dice ? "userA" : "userB" } },
      from: { connect: { email: dice ? "userB" : "userA" } },
      conversation: { connect: { id: conversation.id } },
      read: false,
    });
  }

  // Create all type of notifications

  // await prisma.createNotification({
  //   who: { connect: [{ email: "userA" }, { email: "userB" }] },
  //   type: "COMMENT",
  //   status: "INFORMATION",
  //   new: false,
  //   debate: { connect: { id: standardDebates[0].id } },
  //   userId: A.id,
  // });

  // await prisma.createNotification({
  //   who: { connect: [{ email: "userA" }] },
  //   type: "CLOSE_DEBATE",
  //   status: "PENDING",
  //   new: false,
  //   debate: { connect: { id: standardDebates[0].id } },
  //   userId: A.id,
  // });

  // await prisma.createNotification({
  //   who: { connect: [{ email: "userA" }] },
  //   type: "LIKE",
  //   status: "INFORMATION",
  //   new: false,
  //   comment: { connect: { id: comments[0].id } },
  //   userId: A.id,
  // });

  // await prisma.createNotification({
  //   who: { connect: [{ email: "userA" }, { email: "userB" }] },
  //   type: "DISLIKE",
  //   status: "INFORMATION",
  //   new: false,
  //   comment: { connect: { id: comments[0].id } },
  //   userId: A.id,
  // });

  // await prisma.createNotification({
  //   who: { connect: [{ email: "userA" }] },
  //   type: "REJECT_DUO",
  //   status: "INFORMATION",
  //   new: false,
  //   userId: A.id,
  // });

  // await prisma.createNotification({
  //   who: { connect: [{ email: "userA" }] },
  //   type: "ACCEPT_DUO",
  //   status: "INFORMATION",
  //   new: false,
  //   debate: { connect: { id: duoDebates[0].id } },
  //   userId: A.id,
  // });

  // await prisma.createNotification({
  //   who: { connect: [{ email: "userA" }] },
  //   type: "ACCEPT_CLOSE_DEBATE",
  //   status: "INFORMATION",
  //   new: false,
  //   debate: { connect: { id: standardDebates[0].id } },
  //   userId: A.id,
  // });

  // await prisma.createNotification({
  //   who: { connect: [{ email: "userA" }] },
  //   type: "REJECT_CLOSE_DEBATE",
  //   status: "INFORMATION",
  //   new: false,
  //   debate: { connect: { id: standardDebates[0].id } },
  //   userId: A.id,
  // });

  // await prisma.createNotification({
  //   who: { connect: [{ email: "userA" }] },
  //   type: "VOTE",
  //   status: "INFORMATION",
  //   new: true,
  //   debate: { connect: { id: standardDebates[0].id } },
  //   userId: A.id,
  // });

  // await prisma.createNotification({
  //   who: { connect: [{ email: "userA" }] },
  //   type: "INVITATION_DUO",
  //   status: "PENDING",
  //   new: true,
  //   debate: { connect: { id: duoDebates[0].id } },
  //   userId: A.id,
  // });

  // Trophies

  for (let index = 0; index < 7; index++) {
    if (index % 2 === 0)
      await prisma.createTrophy({
        user: { connect: { email: "userA" } },
        won: true,
        type: "DUO",
        debate: { connect: { id: duoDebates[0].id } },
      });
    else {
      await prisma.createTrophy({
        user: { connect: { email: "userA" } },
        won: true,
        type: "TOP_COMMENT",
        // debate: { connect: { id: comments[0].debate.id } },
        comment: { connect: { id: comments[0].id } },
      });
    }
  }

  // Interactions
  // await prisma.createInteraction({
  //   who: { connect: { email: "userA" } },
  //   type: "LIKE",
  //   comment: { connect: { id: comments[0].id } },
  // });

  // await prisma.createInteraction({
  //   who: { connect: { email: "userA" } },
  //   type: "DISLIKE",
  //   comment: { connect: { id: comments[0].id } },
  // });

  // await prisma.createInteraction({
  //   who: { connect: { email: "userA" } },
  //   type: "COMMENT",
  //   comment: { connect: { id: comments[0].id } },
  // });

  // await prisma.createInteraction({
  //   who: { connect: { email: "userA" } },
  //   type: "BLUE_VOTE",
  //   debate: { connect: { id: duoDebates[0].id } },
  // });

  // await prisma.createInteraction({
  //   who: { connect: { email: "userA" } },
  //   type: "RED_VOTE",
  //   debate: { connect: { id: duoDebates[0].id } },
  // });

  // await prisma.createInteraction({
  //   who: { connect: { email: "userA" } },
  //   type: "POSITIVE_VOTE",
  //   debate: { connect: { id: standardDebates[0].id } },
  // });

  // await prisma.createInteraction({
  //   who: { connect: { email: "userA" } },
  //   type: "NEGATIVE_VOTE",
  //   debate: { connect: { id: standardDebates[0].id } },
  // });
}

main().catch(console.error);
