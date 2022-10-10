const dao = require('./dao');

module.exports = {
  Expense: {
    proveedor: async (parent, _args, { loader }, info) => {
      return await dao.loaderProvider({ parent, info, loader });
    },

    concepto: async (parent, _args, { loader }, info) => {
      return await dao.loaderConcept({ parent, info, loader });
    },

    usuario: async (parent, _args, { loader }, info) => {
      return await dao.loaderUser({ parent, info, loader });
    },
  },
  Query: {
    allExpenses: async (_, { page, search }) => {
      return await dao.findAllExpenses({ page, search });
    },

  
    getExpense: async (_, { id }) => {
      return await dao.findOneExpense({ id });
    },
  },
  Mutation: {
    addExpense: async (_, { input }, { current }) => {
      return await dao.createExpense({ input, current });
    },
    updateExpense: async (_, { id, input }) => {
      return await dao.setExpense({ id, input });
    },
    deleteExpense: async (_, { id }) => {
      return await dao.removeExpense({ id });
    },
  },
};
