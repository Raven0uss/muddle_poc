import { objectType, scalarType } from "nexus/dist";
import moment from "moment";

const DateScalar = scalarType({
  name: "DateTime",
  asNexusMethod: "date",
  description: "Date custom scalar type",

  parseValue(value) {
    return new Date(value);
  },

  serialize(value) {
    return value.getTime();
  },

  parseLiteral(ast) {
    if (ast.kind === "IntValue") return new Date(ast.value);
    if (ast.kind === "StringValue") return moment(ast.value);

    return null;
  },
});

const Token = objectType({
  name: "Token",
  definition(t) {
    t.string("token");
  },
});

export default { Token, DateScalar };
