import { prisma } from "../../prisma/generated/prisma-client";
import moment from "moment";

const fragmentGetAllComments = `
  fragment GetAllComments on Debate  {
    id
    comments {
      id
      from {
        id
      }
      likes {
        id
      }
    }
  }
`;

const main = async () => {
  const now = new Date();

  const debatesToClose = await prisma.debates({
    where: {
      published: true,
      closed: false,
      timelimit_lt: now,
    },
  });

  moment.locale("fr");

  console.log(`[${moment().format("DD/MM/YYYY - HH:mm:ss")}]`);
  console.log("-----------------------------------");
  console.log(`${debatesToClose.length} debates to close...`);

  let trophiesDuo = 0;
  let trophiesTopComment = 0;
  Promise.all(
    debatesToClose.map(async (d) => {
      const debate = await prisma.updateDebate({
        where: {
          id: d.id,
        },
        data: {
          closed: true,
        },
      });
      if (debate.type === "DUO") {
        const redVotes = await prisma.debate({ id: debate.id }).redVotes();
        const blueVotes = await prisma.debate({ id: debate.id }).blueVotes();

        if (redVotes.length === blueVotes.length) return debate;

        const ownerRed = await prisma.debate({ id: debate.id }).ownerRed();
        const ownerBlue = await prisma.debate({ id: debate.id }).ownerBlue();

        const winnerId =
          redVotes.length > blueVotes.length ? ownerRed.id : ownerBlue.id;

        const trophyDuo = await prisma.createTrophy({
          user: { connect: { id: winnerId } },
          won: true,
          type: "DUO",
          debate: { connect: { id: debate.id } },
        });
        trophiesDuo++;
      } else {
        const debateComments = await prisma
          .debate({
            id: debate.id,
            // comments_some: { id_not: currentUser.user.id },
          })
          .$fragment(fragmentGetAllComments);

        const comments = get(debateComments, "comments");
        if (isNil(comments) || comments.length === 0) return debate;

        const sortedComments = comments
          .filter((c) => c.from.id !== currentUser.user.id)
          .sort((a, b) => b.likes.length - a.likes.length);
        if (sortedComments.length === 0) return debate;
        if (sortedComments[0].likes.length === 0) return debate;

        const topCommentId = {
          comment: sortedComments[0].id,
          user: sortedComments[0].from.id,
        };

        const trophyComment = await prisma.createTrophy({
          user: { connect: { id: topCommentId.user } },
          won: true,
          type: "TOP_COMMENT",
          debate: { connect: { id: debate.id } },
          comment: { connect: { id: topCommentId.comment } },
        });
        trophiesTopComment++;
        // Don't use this feature or have to implement remove topComment when deleteComment
        // const updatedDebate = await prisma.updateDebate({
        //   where: { id: debate.id },
        //   data: {
        //     topComment: {
        //       connect: { id: topCommentId.comment },
        //     },
        //   },
        // });
      }
      return debate;
    })
  );

  console.log(`${trophiesDuo} duo trophies delivered.`);
  console.log(`${trophiesTopComment} top comments trophies delivered.`);

  console.log("Closing...");
  console.log("Done...");
  console.log("-----------------------------------");
};

main();
