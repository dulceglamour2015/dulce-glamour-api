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
      return await getCategories({ sort: { _id: -1 } });
    },
    obtenerCategoria: async (_, { id }) => {
      return await getCategory({ id });
    },
    getCategoriesWithProducts: async () => {
      return await catergoriesWithProducts();
    },
    getCategoriesShopping: async () => {
      return await getCategories({
        sort: { nombre: 1 },
        filter: { ecommerce: true },
      });
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
    updateCategoryCommerce: async (_, { id, ecommerce }) => {
      try {
        return await Categoria.findByIdAndUpdate(
          id,
          { ecommerce },
          { new: true }
        );
      } catch (error) {
        console.log(error);
        throw new Error('Error intentalo de nuevo.');
      }
    },
  },
};
