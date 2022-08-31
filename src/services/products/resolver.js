const model = require('./model');
const categoryModel = require('../categories/model');

module.exports = {
  Producto: {
    categoria: async (parent, _args, { loader }) => {
      const res = await categoryModel.loaderCategory(parent.categoria, loader);

      return res;
    },
  },
  Query: {
    getPaginatedProducts: async (_, { search, page }) => {
      return await model.getAllProducts({ search, page });
    },
    getDeletedProducts: async (_, { search, page }) => {
      return await model.getDeletedProducts({ search, page });
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
    shoppingProducts: async (_, { input }) => {
      return await model.getShoppingProducts({ input });
    },
    getOffersProducts: async () => {
      return await model.getOffersProducts();
    },
    getLatestProducts: async () => {
      return await model.getLatestProducts();
    },
    getRelatedProducts: async (_, { categoryId, productId }) => {
      return await model.getRelatedProducts({ categoryId, productId });
    },
    getShoppingProductsSearch: async (_, { search }) => {
      return await model.getShoppingProductsSearch({ search });
    },
  },
  Mutation: {
    addProduct: async (_, { input }) => {
      return await model.addProduct(input);
    },
    nuevoCombo: async (_, { input }) => {
      return await model.addCombo(input);
    },
    updateProduct: async (_, { id, input }, { current }) => {
      return await model.updateProduct(id, input, current);
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
    deleteProduct: async (_, { id }, { current }) => {
      return await model.deleteProduct(id, current.id);
    },
    removeImage: async (_, { id, image }) => {
      return await model.removeImage(id, image);
    },
    reactivateProduct: async (_, { id }) => {
      return await model.reactivateProduct(id);
    },
  },
};
