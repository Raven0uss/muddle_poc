import Query from "./Query";
import Mutation from "./Mutation";
import Subscription from "./Subscription";
import Types from "./Types";

export default {
  resolvers: {
    Mutation,
    Query,
    ...Subscription,
    ...Types,
  },
};
