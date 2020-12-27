import { get } from "lodash";
import moment from "moment";

const filterHomeDebates = ({ debates, following }) => {
  //   const followingListId = following.map((f) => f.id);
  //   const sortedDebates = debates.sort((a, b) => {
  //     if (a.type === "DUO") {
  //       const ownerRed = get(a, "ownerRed.id", "");
  //       const ownerBlue = get(a, "ownerBlue.id", "");

  //       if (
  //         followingListId.indexOf(ownerRed) !== -1 ||
  //         followingListId.indexOf(ownerBlue) !== -1
  //       )
  //         return -1;
  //     }
  //     const owner = get(a, "owner.id", "");
  //     if (followingListId.indexOf(owner)) return -1;

  //     // if (b.type === "DUO") {
  //     //   const ownerBRed = get(b, "ownerRed.id", "");
  //     //   const ownerBBlue = get(b, "ownerBlue.id", "");

  //     //   if (
  //     //     followingListId.indexOf(ownerBRed) !== -1 ||
  //     //     followingListId.indexOf(ownerBBlue) !== -1
  //     //   )
  //     //     return -1;
  //     // }
  //     // const ownerB = get(b, "owner.id", "");
  //     // if (followingListId.indexOf(ownerB)) return -1;

  //     return 0;
  //   });

  //   return sortedDebates;
  const sorted = debates.sort((a, b) => {
    if (a.crowned && a.closed === false) {
      if (b.crowned && b.closed === false) {
        return moment(b.updatedAt).isBefore(a.updatedAt) ? -1 : 1;
      }
      return -1;
    }
    if (b.crowned && b.closed === false) return 1;
    return moment(b.updatedAt).isBefore(a.updatedAt) ? -1 : 1;
  });
  return sorted;
};

export default filterHomeDebates;
