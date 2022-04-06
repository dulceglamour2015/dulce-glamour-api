const dao = require('./dao');

module.exports = {
  getAllProducts: ({ search, page }) => dao.getAllProducts({ search, page }),
  getShoppingProducts: ({ slug, where, sort, limit, oferta }) => {
    return dao.getShoppingProducts({ slug, where, sort, limit, oferta });
  },
  getInventoryProducts: (info) => dao.getInventoryProducts(info),
  getSelectProducts: (info) => dao.getSelectProducts(info),
  getProduct: (id) => dao.getProduct(id),
  addProduct: (input) => dao.addProduct(input),
  addCombo: (input) => dao.addCombo(input),
  updateProduct: (id, input) => dao.updateProduct(id, input),
  updateCombo: ({ id, input, prev }) => dao.updateCombo({ id, input, prev }),
  setInactivateProduct: (id) => dao.setInactivateProduct(id),
  deleteProduct: (id, userId) => dao.deleteProduct(id, userId),
  removeImage: (id, image) => dao.removeImage(id, image),
};
