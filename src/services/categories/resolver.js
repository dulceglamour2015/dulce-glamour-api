const model = require('./model');

module.exports = {
  Query: {
    getPaginatedCategories: async (_, { search, page }) => {
      return await model.getPaginatedCategories({ search, page });
    },
    obtenerCategorias: async () => {
      return await model.getCategories();
    },
    obtenerCategoria: async (_, { id }) => {
      return await model.getCategory(id);
    },
    getCategoriesWithProducts: async () => {
      return await model.getCategoriesWithProducts();
    },
    getCategoriesShopping: async () => {
      return await model.getCategoriesShopping();
    },
  },
  Mutation: {
    nuevaCategoria: async (_, { input }) => {
      return await model.createCategory(input);
    },
    actualizarCategoria: async (_, { id, input }) => {
      return await model.updateCategory(id, input);
    },
    eliminarCategoria: async (_, { id }, { current }) => {
      return await model.deleteCategory(id, current.id);
    },
    removeImageCategory: async (_, { id, image }) => {
      return await model.removeImageCategory(id, image);
    },
    updateCategoryCommerce: async (_, { id, ecommerce }) => {
      return await model.updateCategoryCommerce(id, ecommerce);
    },
  },
};
