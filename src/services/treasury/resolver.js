const dao = require('./dao');

module.exports = {
  Query: {
    getTreasuryResults: async () => {
      return await dao.getTreasuryResults();
    },
  },

  Mutation: {
    createTreasuryResult: async (_, { input }) => {
      return await dao.createTreasuryResult({ input });
    },

    deleteTreasury: async (_, { id }, { current }) => {
      return await dao.deleteTreasury({ id, userId: current.id });
    },
  },
};
