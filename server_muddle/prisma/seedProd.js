require("dotenv").config();

const faker = require("faker");
const bcrypt = require("bcrypt");
const { prisma } = require("./generated/prisma-client");
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
    const imageRandom = userProfile[index];
    const coverRandom = userCover[index];
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

  // Create muddle account
  const M = await prisma.createUser({
    email: "muddles@muddles.fr",
    password: bcrypt.hashSync(process.env.MUDDLES_PASSWORD, 12),
    firstname: "Muddles",
    lastname: "Team",
    birthdate: faker.date.past(),
    certified: true,
    role: "MUDDLE",
    private: true,
    coverPicture:
      "https://cdn.image4.io/muddles-app/f_auto/1ea72fb6-2c06-4f1b-bdab-228993f8c99d.jpg",
    profilePicture:
      "https://cdn.image4.io/muddles-app/f_auto/1c911f32-4c4d-45ad-b4a7-2ea9756ff533.png",
  });

  // Create admin account

  await prisma.createUser({
    email: "administrateur@muddles.fr",
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12),
    firstname: "Admin",
    lastname: "Admin",
    birthdate: faker.date.past(),
    certified: true,
    role: "ADMIN",
    private: true,
    coverPicture:
      "https://cdn.image4.io/muddles-app/f_auto/1ea72fb6-2c06-4f1b-bdab-228993f8c99d.jpg",
    profilePicture:
      "https://cdn.image4.io/muddles-app/f_auto/1c911f32-4c4d-45ad-b4a7-2ea9756ff533.png",
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
    profilePicture:
      "https://cdn.image4.io/muddles/f_auto/ed428672-8299-4011-b5cc-7512cde89f6c.jpg",
  });

  const B = await prisma.createUser({
    email: "userB",
    password: bcrypt.hashSync("test", 12),
    firstname: "Mister",
    lastname: "Robot",
    birthdate: faker.date.past(),
    coverPicture:
      "https://cdn.image4.io/muddles/f_auto/a0808348-5e78-420e-a724-71e247babb37.jpg",
    profilePicture:
      "https://cdn.image4.io/muddles/f_auto/ed428672-8299-4011-b5cc-7512cde89f6c.jpg",
  });

  await prisma.createUser({
    email: "muddles.apple@gmail.com",
    password: bcrypt.hashSync("Test1234!", 12),
    firstname: "Apple",
    lastname: "Test",
    birthdate: faker.date.past(),
  });
}

main().catch(console.error);
