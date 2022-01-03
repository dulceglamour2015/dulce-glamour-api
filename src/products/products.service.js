const { Categoria } = require('../categories/collection');
const { loaderFactory } = require('../utils/loaderFactory');
const { getMongooseSelectionFromReq } = require('../utils/selectFields');
const {
  findAllProducts,
  getProductById,
  getProductByFilter,
  saveProduct,
  discountStock,
  restoreStock,
  setProductByFilter,
  removeProductById,
  checkProductStock,
} = require('./products.lib');
const { Products } = require('./products.model');

module.exports = {
  async getAllProducts(info, search) {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;
    if (!!search) {
      return await Products.find(
        { $text: { $search: search } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(10);
    }

    return await findAllProducts({ fields, filter: { activo: true } });
  },

  async getShoppingProducts({ slug, where, sort, limit, oferta }) {
    const filterToQuery = {
      existencia: { $gt: 10 },
      activo: true,
      nombre: { $not: { $regex: /^TEST \d/ } },
      ecommerce: true,
      oferta: false,
    };

    if (oferta) {
      filterToQuery.oferta = true;
    }

    if (slug) {
      filterToQuery.categoria = slug;
    }
    if (where) {
      filterToQuery._id = where;
    }

    try {
      const products = await Products.find(filterToQuery)
        .sort(sort ? sort : { nombre: 1 })
        .limit(limit ? limit : undefined);

      return products;
    } catch (error) {
      throw new Error('Cannot getting Products!');
    }
  },

  async getInventoryProducts(info) {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;
    return await Products.find({
      existencia: { $gt: 10 },
      activo: true,
      nombre: { $not: { $regex: /^TEST \d/ } },
    }).select(fields);
  },
  async getSelectProducts(info) {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;
    return await Products.find({
      existencia: { $gt: 0 },
      activo: true,
      nombre: { $not: { $regex: /^TEST \d/ } },
    })
      .select(fields)
      .sort({ nombre: 1 });
  },

  async getProduct(id) {
    return await getProductById(id);
  },

  async getCategorieProduct(parent, loader) {
    try {
      return await loaderFactory(loader, Categoria, parent);
    } catch (error) {
      throw new Error('Error al cargar categorias');
    }
  },

  async addProduct(input) {
    const exist = await getProductByFilter({ nombre: input.nombre });
    if (exist) throw new Error(`El producto: ${input.nombre} ya existe`);

    return await saveProduct(input);
  },

  async addCombo(input) {
    const exist = await getProductByFilter({ nombre: input.nombre });
    if (exist) throw new Error(`El combo ${input.nombre} ya existe`);

    if (!!input.combo) {
      if (!(await checkProductStock(input.productosCombo, input.existencia))) {
        await discountStock(input.productosCombo, input.existencia);
        return await saveProduct(input);
      }
    }
  },

  async setCombo({ id, input, prev }) {
    if (input.nombre) {
      const exist = await getProductByFilter({ nombre: input.nombre });
      if (exist) throw new Error(`El combo ${input.nombre} ya existe!`);
    }

    if (prev) {
      await restoreStock(prev.productosCombo, prev.existencia);
    }
    await discountStock(input.productosCombo, input.existencia);

    return await setProductByFilter({ _id: id }, input);
  },

  async updateProduct(id, input) {
    if (input.nombre) {
      const exist = await getProductByFilter({ nombre: input.nombre });
      if (exist) throw new Error(`El producto ${exist.nombre} ya existe!`);
    }

    return await setProductByFilter({ _id: id }, input);
  },

  async setInactivateProduct(id) {
    try {
      return Products.findByIdAndUpdate(
        id,
        { activo: false, existencia: 0 },
        { new: true }
      );
    } catch (error) {
      throw new Error('No se pudo desactivar el producto');
    }
  },

  async deleteProduct(id) {
    const dbProduct = await getProductById(id);

    if (Boolean(dbProduct.combo)) {
      await restoreStock(dbProduct.productosCombo, dbProduct.existencia);
    }

    return await removeProductById(id);
  },
};
