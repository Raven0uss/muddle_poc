import { get, isArray, isNil } from "lodash";

const isFollowing = (user, currentUser) => {
  if (isArray(get(user, "followers")) === false) return false;
  const index = user.followers.findIndex((u) => u.id === currentUser.id);
  return index !== -1;
};

export default isFollowing;
