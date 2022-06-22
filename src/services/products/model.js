const dao = require('./dao');

module.exports = {
  getAllProducts: ({ search, page }) => {
    return dao.getAllProducts({ search, page });
  },
  getDeletedProducts: ({ search, page }) => {
    return dao.getDeletedProducts({ search, page });
  },
  getShoppingProducts: ({ input }) => {
    return dao.getShoppingProducts({ input });
  },
  getOffersProducts: () => {
    return dao.getOffersProducts();
  },
  getLatestProducts: () => {
    return dao.getLatestProducts();
  },
  getRelatedProducts: ({ categoryId, productId }) => {
    return dao.getRelatedProducts({ categoryId, productId });
  },
  getShoppingProductsSearch: ({ search }) => {
    return dao.getShoppingProductsSearch({ search });
  },
  getInventoryProducts: (info) => {
    return dao.getInventoryProducts(info);
  },
  getSelectProducts: (info) => {
    return dao.getSelectProducts(info);
  },
  getProduct: (id) => {
    return dao.getProduct(id);
  },
  addProduct: (input) => {
    return dao.addProduct(input);
  },
  addCombo: (input) => {
    return dao.addCombo(input);
  },
  updateProduct: (id, input) => {
    return dao.updateProduct(id, input);
  },
  updateCombo: ({ id, input, prev }) => {
    return dao.updateCombo({ id, input, prev });
  },
  setInactivateProduct: (id) => {
    return dao.setInactivateProduct(id);
  },
  deleteProduct: (id, userId) => {
    return dao.deleteProduct(id, userId);
  },
  removeImage: (id, image) => {
    return dao.removeImage(id, image);
  },
  reactivateProduct: (id) => {
    return dao.reactivateProduct(id);
  },
};
