import { AuthenticationError } from "apollo-server";

export default {
  Query: {
    ads: async (parent, { id }, { models: { adModel } }, info) => {
      if (!me) {
        throw new AuthenticationError("You are not authenticated");
      }
      const ads = await adModel.find({}).exec();
      return ads;
    },
    ad: async (parent, { id }, { models: { adModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError("You are not authenticated");
      }
      const ad = await adModel.findById({ _id: id }).exec();
      return ad;
    },
  },
  Mutation: {},
};
