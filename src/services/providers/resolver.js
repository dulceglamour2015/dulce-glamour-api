const {
  findAllProviders,
  findOneProvider,
  createProvider,
  setProvider,
  removeProvider,
} = require('./provider.service');

module.exports = {
  Query: {
    allProviders: async (_, __, ___, info) => {
      return await findAllProviders({ info });
    },

    getProvider: async (_, { id }) => {
      return await findOneProvider({ id });
    },
  },
  Mutation: {
    addProvider: async (_, { input }) => {
      return await createProvider({ input });
    },
    updateProvider: async (_, { id, input }) => {
      return await setProvider({ id, input });
    },
    deleteProvider: async (_, { id }) => {
      return await removeProvider({ id });
    },
  },
};
