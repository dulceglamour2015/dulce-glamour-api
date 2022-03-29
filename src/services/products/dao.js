const { getMongooseSelectionFromReq } = require('../../utils/selectFields');
const {
  findAllProducts,
  getProductById,
  getProductByFilter,
  saveProduct,
  discountStock,
  restoreStock,
  setProductByFilter,
  checkProductStock,
} = require('./lib');
const { Products } = require('./collection');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');

module.exports = {
  async getAllProducts(info, search) {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;

    try {
      return await Products.find().sort({ _id: -1 });
    } catch (error) {
      console.log(error);
      throw new Error('No se pudieron obtener los productos');
    }
  },

  async getShoppingProducts({ slug, where, sort, limit, oferta }) {
    const filterToQuery = {
      existencia: { $gt: 10 },
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
      nombre: { $not: { $regex: /^TEST \d/ } },
    }).select(fields);
  },

  async getSelectProducts(info) {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;
    return await Products.find({
      existencia: { $gt: 0 },
      nombre: { $not: { $regex: /^TEST \d/ } },
    })
      .select(fields)
      .sort({ nombre: 1 });
  },

  async getProduct(id) {
    try {
      return await Products.findById(id);
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
  async addProduct(input) {
    try {
      const exist = await getProductByFilter({ nombre: input.nombre });
      if (exist) throw new Error(`El producto: ${input.nombre} ya existe`);

      const product = new Products(input);
      await product.save();
      return product;
    } catch (error) {
      console.log(error);
      throw new Error('Error! no se ha guardado el producto.');
    }
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

  async updateCombo({ id, input, prev }) {
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
    try {
      const { nombre, ...body } = input;
      let bodyInsert = { ...body };
      const dbProduct = await Products.findById(id);
      if (dbProduct.nombre !== nombre) {
        bodyInsert.nombre = nombre;
      }

      if (bodyInsert.nombre) {
        const exists = await Products.findOne({ nombre: bodyInsert.nombre });
        if (exists) throw Error();
      }

      const product = await Products.findOneAndUpdate({ _id: id }, bodyInsert, {
        new: true,
      });
      return product;
    } catch (error) {
      console.log(error);
      throw new Error('Algo salio mal, no se ha podido editar el product.');
    }
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

  async deleteProduct(id, userId) {
    const dbProduct = await getProductById(id);

    if (Boolean(dbProduct.combo)) {
      await restoreStock(dbProduct.productosCombo, dbProduct.existencia);
    }
    console.log({ userId });
    try {
      await Products.deleteById(id, userId);
      return 'Success';
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  async removeImage(id, image) {
    const product = await Products.findById(id);

    product.images = product.images.filter((img) => img !== image);

    try {
      await product.save();
      return product;
    } catch (error) {
      throw new Error('No se ha podido eliminar la imagen.');
    }
  },
};
