const {
  getAllPurchases,
  getPurchase,
  addPurchase,
  deletePurchase,
} = require('../../purchase/purchase.service');
const { Provider } = require('../../database/Provider');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');

module.exports = {
  Purchase: {
    proveedor: async (parent) => {
      try {
        return await Provider.findById(parent.proveedor);
      } catch (error) {
        throw new Error('No existe proveedor');
      }
    },
  },
  Query: {
    getAllPurchases: async (parent, args, ctx, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;

      return await getAllPurchases(fields);
    },
    getPurchase: async (_, { id }) => {
      return await getPurchase(id);
    },
  },
  Mutation: {
    addPurchase: async (_, { input }) => {
      return await addPurchase(input);
    },
    deletePurchase: async (_, { id }) => {
      return await deletePurchase(id);
    },
  },
};
