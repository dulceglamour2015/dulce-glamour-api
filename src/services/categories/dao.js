'use strict';

const graphqlErrRes = require('../../utils/graphqlErrorRes');
const { ApolloError } = require('apollo-server-errors');
const { Categoria } = require('./collection');
const { Products } = require('../products/collection');
const { loaderFactory } = require('../../utils/loaderFactory');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');

module.exports = {
  async getCategories() {
    try {
      return await Categoria.find().sort({ nombre: 1 });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  async getCategory(id) {
    return new Promise((resolve, reject) =>
      Categoria.findById(id).exec((error, result) => {
        if (error) return reject(graphqlErrRes[404]);
        return resolve(result);
      })
    );
  },

  async getCategoriesShopping() {
    return new Promise((resolve, reject) =>
      Categoria.find()
        .sort({ nombre: 1 })
        .exec((error, result) => {
          if (error) return reject(graphqlErrRes[404]);
          return resolve(result);
        })
    );
  },

  async getCategoriesWithProducts() {
    try {
      const res = await Categoria.aggregate([
        {
          $match: { deleted: false },
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'categoria',
            as: 'categorieProducts',
          },
        },
        { $unwind: '$categorieProducts' },
        {
          $match: {
            $and: [
              { 'categorieProducts.existencia': { $gt: 0 } },
              { 'categorieProducts.deleted': false },
            ],
          },
        },
        {
          $group: {
            _id: '$_id',
            root: { $mergeObjects: '$$ROOT' },
            productos: { $push: '$categorieProducts' },
          },
        },
        {
          $sort: { 'root.nombre': 1 },
        },
      ]);

      return res.map((item) => ({
        nombre: item.root.nombre,
        productos: item.productos,
      }));
    } catch (error) {
      handleErrorResponse({ errorMsg: error, message: 'BAD_RESPONSE' });
    }
  },

  async createCategory(input) {
    const exist = await Categoria.findOne({ nombre: input.nombre });
    if (exist) throw new ApolloError('Document alredy exist');

    return new Promise((res, rej) => {
      const categoria = new Categoria({
        nombre: input.nombre,
        ecommerce: input.ecommerce ? input.ecommerce : false,
        descripcion: input.descripcion ? input.descripcion : '',
        images: input.images ? input.images : [],
      });

      categoria.id = categoria._id;
      categoria
        .save()
        .then((savedCategory) => res(savedCategory))
        .catch(() => rej(graphqlErrRes[400]));
    });
  },

  async updateCategory(id, input) {
    return new Promise((resolve, reject) =>
      Categoria.findByIdAndUpdate(id, input, { new: true }).exec(
        (error, result) => {
          if (error) return reject(graphqlErrRes[400]);
          return resolve(result);
        }
      )
    );
  },

  async deleteCategory(id, userId) {
    try {
      await Categoria.deleteById(id, userId);
      return 'Success';
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  async updateCategoryCommerce(id, ecommerce) {
    return new Promise((resolve, reject) =>
      Categoria.findByIdAndUpdate(id, { ecommerce }, { new: true }).exec(
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      )
    );
  },

  async removeImageCategory(id, image) {
    const category = await Categoria.findById(id);

    category.images = category.images.filter((img) => img !== image);

    return new Promise((resolve, reject) =>
      category
        .save()
        .then((saved) => resolve(saved))
        .catch((err) => reject(graphqlErrRes[400]))
    );
  },

  async loaderCategory(parent, loader) {
    try {
      return await loaderFactory(loader, Categoria, parent);
    } catch (error) {
      throw new Error('Error al cargar categorias');
    }
  },
};
