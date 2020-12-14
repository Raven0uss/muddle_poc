const hasVoted = ({
  positives,
  negatives,
  blueVotes,
  redVotes,
  currentUser,
}) => {
  for (let index = 0; index < positives.length; index++) {
    const element = positives[index];
    if (element.id === currentUser.id) return "pour";
  }

  for (let index = 0; index < negatives.length; index++) {
    const element = negatives[index];
    if (element.id === currentUser.id) return "contre";
  }

  for (let index = 0; index < blueVotes.length; index++) {
    const element = blueVotes[index];
    if (element.id === currentUser.id) return "pour";
  }

  for (let index = 0; index < redVotes.length; index++) {
    const element = redVotes[index];
    if (element.id === currentUser.id) return "contre";
  }

  return null;
};

export default hasVoted;
