const model = require('./model');
const categoryModel = require('../categories/model');

module.exports = {
  Producto: {
    categoria: async (parent, _args, { loader }) => {
      return await categoryModel.loaderCategory(parent.categoria, loader);
    },
  },
  Query: {
    allProducts: async (_, { search }, ___, info) => {
      return await model.getAllProducts(info, search);
    },
    selectProducts: async (_, __, ___, info) => {
      return await model.getSelectProducts(info);
    },
    inventoryProducts: async (_, __, ___, info) => {
      return await model.getInventoryProducts(info);
    },
    getProduct: async (_, { id }) => {
      return await model.getProduct(id);
    },
    shoppingProducts: async (_, { slug, where, sort, limit, oferta }) => {
      return await model.getShoppingProducts({
        slug,
        where,
        sort,
        limit,
        oferta,
      });
    },
  },
  Mutation: {
    nuevoProducto: async (_, { input }) => {
      return await model.addProduct(input);
    },
    nuevoCombo: async (_, { input }) => {
      return await model.addCombo(input);
    },
    actualizarProducto: async (_, { id, input }) => {
      return await model.updateProduct(id, input);
    },
    inactivateProduct: async (_, { id }) => {
      return model.setInactivateProduct(id);
    },
    setCombo: async (_, { id, input, prev }) => {
      return await model.updateCombo({
        prev,
        input,
        id,
      });
    },
    eliminarProducto: async (_, { id }) => {
      return await model.deleteProduct(id);
    },
    removeImage: async (_, { id, image }) => {
      return await model.removeImage(id, image);
    },
  },
};