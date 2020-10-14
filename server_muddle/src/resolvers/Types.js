import { objectType } from "nexus/dist";


const Token = objectType({
  name: "Token",
  definition(t) {
    t.string("token");
  },
});

export default { Token };