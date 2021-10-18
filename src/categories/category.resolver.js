const { Categoria } = require('./category.model');
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
      return await getCategories({ filter: { _id: -1 } });
    },
    obtenerCategoria: async (_, { id }) => {
      return await getCategory({ id });
    },
    getCategoriesWithProducts: async () => {
      return await catergoriesWithProducts();
    },
    getCategoriesShopping: async () => {
      return await getCategories({ filter: { nombre: 1 } });
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
    removeImageCategory: async (_, { id, image }) => {
      const category = await Categoria.findById(id);

      category.images = category.images.filter((img) => img !== image);

      try {
        await category.save();
        return category;
      } catch (error) {
        throw new Error('No se ha podido eliminar la imagen.');
      }
    },
  },
};
