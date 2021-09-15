const {
  getAllProducts,
  getProduct,
  getCategorieProduct,
  addProduct,
  addCombo,
  updateProduct,
  deleteProduct,
  setCombo,
  getInventoryProducts,
  setInactivateProduct,
  getSelectProducts,
  getShoppingProducts,
} = require('./products.service');

module.exports = {
  Producto: {
    categoria: async (parent, _args, { loader }) => {
      return await getCategorieProduct(parent.categoria, loader);
    },
  },
  Query: {
    allProducts: async (_, { search }, ___, info) => {
      return await getAllProducts(info, search);
    },
    selectProducts: async (_, __, ___, info) => {
      return await getSelectProducts(info);
    },
    inventoryProducts: async (_, __, ___, info) => {
      return await getInventoryProducts(info);
    },
    obtenerProducto: async (_, { id }) => {
      return await getProduct(id);
    },
    shoppingProducts: async (_, { slug, where, sort, limit }) => {
      return await getShoppingProducts({ slug, where, sort, limit });
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
    inactivateProduct: async (_, { id }) => {
      return setInactivateProduct(id);
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
