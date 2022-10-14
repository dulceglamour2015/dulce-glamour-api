const dao = require('./dao');

module.exports = {
  Query: {
    getBox: async (_, { id }) => {
      return await dao.getBox({ id });
    },
    getAllBox: async (_, { page, search }) => {
      return await dao.getAllBox({ page, search });
    },
  },

  Mutation: {
    createBox: async (_, { input }) => {
      return await dao.createBox({ input });
    },
    updateBox: async (_, { id, input }) => {
      return await dao.updateBox({ id, input });
    },
    deleteBox: async (_, { id }, { current }) => {
      return await dao.deleteBox({ id, userId: current.id });
    },
    getSettlement: async (_, filter) => {
      return await dao.getSettlement({ filter });
    },
  },
};
