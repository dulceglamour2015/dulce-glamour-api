const {
  getAggregateClientFilter,
  getAggregateSellerFilter,
} = require('./service');

module.exports = {
  Query: {
    mejoresClientes: async (_, { filter }) => {
      return await getAggregateClientFilter(filter);
    },
    mejoresVendedores: async (_, { filter }) => {
      return await getAggregateSellerFilter(filter);
    },
  },

  Mutation: {},
};
