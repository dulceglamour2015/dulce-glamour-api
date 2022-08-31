const getPaginateOptions = require('../../config/paginationsOptions');
const graphqlErrRes = require('../../utils/graphqlErrorRes');
const lib = require('./utils');

const { Categoria } = require('./collection');
const { loaderFactory } = require('../../utils/loaderFactory');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');

module.exports = {
  async getPaginatedCategories({ search, page }) {
    const options = getPaginateOptions({
      page,
      limit: 10,
      sort: { nombre: 1 },
    });

    try {
      if (search) {
        const searchOptions = getPaginateOptions({
          page,
          limit: 10,
          sort: { score: { $meta: 'textScore' } },
          projection: { score: { $meta: 'textScore' } },
        });

        return await lib.getPaginatedCategories({
          searchOptions,
          query: { $text: { $search: search }, deleted: false },
        });
      }

      return await lib.getPaginatedCategories({
        query: { deleted: false },
        options,
      });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  async getCategories() {
    try {
      return await Categoria.find({ deleted: false }).sort({ nombre: 1 });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  async getCategory(id) {
    try {
      return await Categoria.findById(id);
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  async getCategoriesShopping() {
    try {
      return await Categoria.find({ deleted: false, ecommerce: true }).sort({
        nombre: 1,
      });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  async getCategoriesWithProducts() {
    try {
      const res = await Categoria.aggregate(
        lib.AGGREGATEOPTIONCATEGORIESINVENTORY
      );
      const data = lib.getCategoriesInventoryResponse(res);
      return data;
    } catch (error) {
      handleErrorResponse({ errorMsg: error, message: 'BAD_RESPONSE' });
    }
  },

  async createCategory(input) {
    try {
      const dbInput = {
        nombre: input.nombre,
        ecommerce: input.ecommerce,
        descripcion: input.descripcion,
        images: input.images,
      };

      const category = new Categoria(dbInput);

      category.id = category._id;

      await category.save();

      return category;
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  async updateCategory(id, input, current) {
    try {
      return await Categoria.findByIdAndUpdate(
        id,
        { ...input, updatedBy: current.id },
        { new: true }
      );
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  async deleteCategory(id, userId) {
    try {
      await Categoria.deleteById(id, userId);
      return 'Success';
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  async removeImageCategory(id, image) {
    try {
      const category = await Categoria.findById(id);

      category.images = category.images.filter((img) => img !== image);

      await category.save();

      return category;
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  async loaderCategory(parent, loader) {
    try {
      return await loaderFactory(loader, Categoria, parent);
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
};
