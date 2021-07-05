const {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} = require('../../categories/category.service');

module.exports = {
  Query: {
    obtenerCategorias: async () => {
      return await getCategories();
    },
    obtenerCategoria: async (_, { id }) => {
      return await getCategory({ id });
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
