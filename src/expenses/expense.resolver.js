const {
  loaderProvider,
  loaderConcept,
  loaderUser,
  findAllExpenses,
  findOneExpense,
  createExpense,
  setExpense,
  removeExpense,
} = require('./expense.service');

module.exports = {
  Expense: {
    proveedor: async (parent, _args, _ctx, info) => {
      return await loaderProvider({ parent, info });
    },

    concepto: async (parent, _args, _ctx, info) => {
      return await loaderConcept({ parent, info });
    },

    usuario: async (parent, _args, _ctx, info) => {
      return await loaderUser({ parent, info });
    },
  },
  Query: {
    allExpenses: async (_, __, ___, info) => {
      return await findAllExpenses({ info });
    },

    getExpense: async (_, { id }) => {
      return await findOneExpense({ id });
    },
  },
  Mutation: {
    addExpense: async (_, { input }, { current }) => {
      return await createExpense({ input, current });
    },
    updateExpense: async (_, { id, input }) => {
      return await setExpense({ id, input });
    },
    deleteExpense: async (_, { id }) => {
      return await removeExpense({ id });
    },
  },
};
