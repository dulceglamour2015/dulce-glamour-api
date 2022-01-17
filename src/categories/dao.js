'use strict';

const graphqlErrRes = require('../utils/graphqlErrorRes');
const { ApolloError } = require('apollo-server-errors');
const { Categoria } = require('./collection');

module.exports = {
  async getCategories() {
    return new Promise((resolve, reject) =>
      Categoria.find()
        .sort({ _id: -1 })
        .exec((err, result) => {
          if (err) return reject(graphqlErrRes[404]);
          return resolve(result);
        })
    );
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
    return new Promise((resolve, reject) =>
      Categoria.aggregate([
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
            'categorieProducts.existencia': { $gt: 0 },
            'categorieProducts.nombre': { $not: { $regex: /^TEST \d/ } },
          },
        },
        {
          $group: {
            _id: '$_id',
            root: { $mergeObjects: '$$ROOT' },
            productos: { $push: '$categorieProducts' },
          },
        },
      ]).exec((error, result) => {
        if (error) return reject(graphqlErrRes[404]);
        return resolve(
          result.map((item) => ({
            nombre: item.root.nombre,
            productos: item.productos,
          }))
        );
      })
    );
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

  async deleteCategory(id) {
    return new Promise((resolve, reject) =>
      Categoria.findByIdAndDelete(id).exec((error, result) => {
        if (error) return reject(graphqlErrRes[400]);
        return resolve('Document deleted successfully');
      })
    );
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
};
