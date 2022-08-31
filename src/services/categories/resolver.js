const model = require('./model');

module.exports = {
  Query: {
    getPaginatedCategories: async (_, { search, page }) => {
      return await model.getPaginatedCategories({ search, page });
    },
    getCategories: async () => {
      return await model.getCategories();
    },
    getCategorie: async (_, { id }) => {
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
    addCategory: async (_, { input }) => {
      return await model.createCategory(input);
    },
    updateCategory: async (_, { id, input }, { current }) => {
      return await model.updateCategory(id, input, current);
    },
    deleteCategory: async (_, { id }, { current }) => {
      return await model.deleteCategory(id, current.id);
    },
    removeImageCategory: async (_, { id, image }) => {
      return await model.removeImageCategory(id, image);
    },
  },
};
