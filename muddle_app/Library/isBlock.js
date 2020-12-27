import { get } from "lodash";

const isBlocked = ({ currentUser, userId }) => {
  const blocked = get(currentUser, "blocked", []);
  return blocked.findIndex((b) => b.id === userId) !== -1;
};

const isBlockingMe = ({ currentUser, userId }) => {
  const blocking = get(currentUser, "blocking", []);
  return blocking.findIndex((b) => b.id === userId) !== -1;
};

export { isBlocked, isBlockingMe };
