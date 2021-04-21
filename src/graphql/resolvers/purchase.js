const {
  getAllPurchases,
  getPurchase,
  addPurchase,
  deletePurchase
} = require('../../services/purchaseServise');
const { Provider } = require('../../database/Provider');

module.exports = {
  Purchase: {
    proveedor: async (parent) => {
      try {
        return await Provider.findById(parent.proveedor);
      } catch (error) {
        throw new Error('No existe proveedor');
      }
    }
  },
  Query: {
    getAllPurchases: async () => {
      return await getAllPurchases();
    },
    getPurchase: async (_, { id }) => {
      return await getPurchase(id);
    }
  },
  Mutation: {
    addPurchase: async (_, { input }) => {
      return await addPurchase(input);
    },
    deletePurchase: async (_, { id }) => {
      return await deletePurchase(id);
    }
  }
};
