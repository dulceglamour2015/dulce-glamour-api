const dao = require('./dao');

module.exports = {
  async getCategories() {
    return dao.getCategories();
  },

  async getCategory(id) {
    return dao.getCategory(id);
  },

  async getPaginatedCategories({ search, page }) {
    return dao.getPaginatedCategories({ search, page });
  },

  async getCategoriesWithProducts() {
    return dao.getCategoriesWithProducts();
  },

  async getCategoriesShopping() {
    return dao.getCategoriesShopping();
  },

  async createCategory(input) {
    return dao.createCategory(input);
  },

  async updateCategory(id, input) {
    return dao.updateCategory(id, input);
  },

  async deleteCategory(id, userId) {
    return dao.deleteCategory(id, userId);
  },

  async updateCategoryCommerce(id, ecommerce) {
    return dao.updateCategoryCommerce(id, ecommerce);
  },

  async removeImageCategory(id, image) {
    return dao.removeImageCategory(id, image);
  },

  async loaderCategory(parent, loader) {
    return dao.loaderCategory(parent, loader);
  },
};
