const dao = require('./dao');

module.exports = {
  Query: {
    allProviders: async (_, { page, search }) => {
      return await dao.findAllProviders({ page, search });
    },

    getSelectProviders: async (_, __, ___, info) => {
      return await dao.getSelectProviders({ info });
    },

    getProvider: async (_, { id }) => {
      return await dao.findProvider({ id });
    },
  },
  Mutation: {
    addProvider: async (_, { input }) => {
      return await dao.createProvider({ input });
    },
    updateProvider: async (_, { id, input }) => {
      return await dao.setProvider({ id, input });
    },
    deleteProvider: async (_, { id }) => {
      return await dao.removeProvider({ id });
    },
  },
};
