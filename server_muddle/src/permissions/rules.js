import { get } from "lodash";
import { rule } from "graphql-shield";

// Authentication

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.currentUser !== null;
  }
);

// Roles

const isAdmin = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return get(ctx, "currentUser.role") === "ADMIN";
  }
);

const isModerator = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return get(ctx, "currentUser.role") === "MODERATOR";
  }
);

const isStandard = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return get(ctx, "currentUser.role") === "STANDARD";
  }
);

const isMuddle = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return get(ctx, "currentUser.role") === "MUDDLE";
  }
);

export { isAuthenticated, isAdmin, isModerator, isMuddle, isStandard };
