import { cloneDeepWith, isNil, findIndex } from "lodash";

const voteDispatch = ({
  setDebates,
  debateIndex,
  setHomeDebates,
  voteType, //String: negatives, positives, blueVotes, redVotes
  currentUser,
  debate,
}) => {
  if (!isNil(setDebates))
    setDebates((d) => {
      const copyDebates = cloneDeepWith(d);
      copyDebates[debateIndex][voteType].push({
        id: currentUser.id,
      });
      if (!isNil(setHomeDebates)) {
        setHomeDebates((homeDebates) => {
          const copyHomeDebates = cloneDeepWith(homeDebates);

          console.log(copyHomeDebates.length);
          const homeDebateIndex = findIndex(
            copyHomeDebates,
            (h) => h.id === copyDebates[debateIndex].id
          );

          console.log(homeDebateIndex);

          if (homeDebateIndex !== -1) {
            copyHomeDebates[homeDebateIndex][voteType].push({
              id: currentUser.id,
            });
            return copyHomeDebates;
          }
          return homeDebates;
        });
      }
      return copyDebates;
    });
  else if (!isNil(setHomeDebates) && !isNil(debate)) {
    setHomeDebates((homeDebates) => {
      const copyHomeDebates = cloneDeepWith(homeDebates);

      console.log(copyHomeDebates.length);
      const homeDebateIndex = findIndex(
        copyHomeDebates,
        (h) => h.id === debate.id
      );

      console.log(homeDebateIndex);
      if (homeDebateIndex !== -1) {
        copyHomeDebates[homeDebateIndex][voteType].push({
          id: currentUser.id,
        });
        return copyHomeDebates;
      }
      return homeDebates;
    });
  }
};

export default voteDispatch;
