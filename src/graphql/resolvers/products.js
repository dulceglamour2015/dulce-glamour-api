const {
  getAllProducts,
  getProduct,
  getCategorieProduct,
  addProduct,
  addCombo,
  updateProduct,
  deleteProduct,
  setCombo,
} = require('../../products/products.service');

module.exports = {
  Producto: {
    categoria: async (parent, _args, { loader }) => {
      return await getCategorieProduct(parent.categoria, loader);
    },
  },
  Query: {
    allProducts: async (_, __, ___, info) => {
      return await getAllProducts(info);
    },
    obtenerProducto: async (_, { id }) => {
      return await getProduct(id);
    },
  },
  Mutation: {
    nuevoProducto: async (_, { input }) => {
      return await addProduct(input);
    },
    nuevoCombo: async (_, { input }) => {
      return await addCombo(input);
    },
    actualizarProducto: async (_, { id, input }) => {
      return await updateProduct(id, input);
    },
    setCombo: async (_, { id, input, prev }) => {
      return await setCombo({
        prev,
        input,
        id,
      });
    },
    eliminarProducto: async (_, { id }) => {
      return await deleteProduct(id);
    },
  },
};
