import { get } from "lodash";

const filterHomeDebates = ({ debates, following }) => {
  const followingListId = following.map((f) => f.id);
  const sortedDebates = debates.sort((a, b) => {
    if (a.type === "DUO") {
      const ownerRed = get(a, "ownerRed.id", "");
      const ownerBlue = get(a, "ownerBlue.id", "");

      if (
        followingListId.indexOf(ownerRed) !== -1 ||
        followingListId.indexOf(ownerBlue) !== -1
      )
        return -1;
    }
    const owner = get(a, "owner.id", "");
    if (followingListId.indexOf(owner)) return -1;

    return 0;
  });

  return sortedDebates;
};

export default filterHomeDebates;
