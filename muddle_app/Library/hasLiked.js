const hasLiked = ({ likes, dislikes, currentUser }) => {
  for (let index = 0; index < dislikes.length; index++) {
    const element = dislikes[index];
    if (element.id === currentUser.id) return "dislike";
  }

  for (let index = 0; index < likes.length; index++) {
    const element = likes[index];
    if (element.id === currentUser.id) return "like";
  }

  return null;
};

export default hasLiked;
