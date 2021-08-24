const {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  catergoriesWithProducts,
} = require('./category.service');

module.exports = {
  Query: {
    obtenerCategorias: async () => {
      return await getCategories();
    },
    obtenerCategoria: async (_, { id }) => {
      return await getCategory({ id });
    },
    getCategoriesWithProducts: async () => {
      return await catergoriesWithProducts();
    },
  },
  Mutation: {
    nuevaCategoria: async (_, { input }) => {
      return await addCategory({ input });
    },
    actualizarCategoria: async (_, { id, input }) => {
      return await updateCategory({ id, input });
    },
    eliminarCategoria: async (_, { id }) => {
      return await deleteCategory({ id });
    },
  },
};
