const { getMongooseSelectionFromReq } = require('../../utils/selectFields');
const {
  getProductByFilter,
  saveProduct,
  discountStock,
  restoreStock,
  setProductByFilter,
  checkProductStock,
  getPaginatedProducts,
} = require('./lib');
const { Products } = require('./collection');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');
const getPaginateOptions = require('../../config/paginationsOptions');

module.exports = {
  async getAllProducts({ page, search }) {
    const options = getPaginateOptions({ page, limit: 10 });
    const query = {
      $and: [{ existencia: { $gte: 0 } }, { deleted: false }],
    };
    try {
      if (search) {
        return getPaginatedProducts({
          query: {
            ...query,
            $text: { $search: search },
          },
          options: { ...options },
        });
      }

      return getPaginatedProducts({
        query,
        options: { ...options, sort: { nombre: 1 } },
      });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  async getDeletedProducts({ page, search }) {
    const options = getPaginateOptions({ page, limit: 10 });
    const query = { $and: [{ deleted: true }, { existencia: { $gte: 0 } }] };
    try {
      if (search) {
        return getPaginatedProducts({
          query: { ...query, $text: { $search: search } },
          options: { ...options },
        });
      }

      const res = await getPaginatedProducts({
        query,
        options: { ...options, sort: { nombre: 1 } },
      });

      return res;
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  async getShoppingProducts({ slug, where, sort, limit, oferta, search }) {
    const filterToQuery = {
      $and: [
        { existencia: { $gt: 10 } },
        { ecommerce: true },
        { oferta: false },
        { deleted: false },
      ],
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

    if (search) {
      try {
        console.log({ search });
        const filterProducts = await Products.find({
          ...filterToQuery,
          $text: { $search: search },
        });
        console.log({ filterProducts: filterProducts.length });

        return filterProducts;
      } catch (error) {
        handleErrorResponse({ errorMsg: error, message: 'BAD_RESPONSE' });
      }
    }

    try {
      const products = await Products.find(filterToQuery)
        .sort(sort ? sort : { nombre: 1 })
        .limit(limit ? limit : undefined);

      console.log({ products: products.length });
      return products;
    } catch (error) {
      throw new Error('Cannot getting Products!');
    }
  },

  async getInventoryProducts(info) {
    try {
      const aggregate = await Products.aggregate([
        { $match: { deleted: false, existencia: { $gte: 0 } } },
        {
          $lookup: {
            from: 'categorias',
            localField: 'categoria',
            foreignField: '_id',
            as: 'categoria',
          },
        },
        {
          $match: {
            'categoria.deleted': false,
          },
        },
        { $unwind: '$categoria' },
      ]);

      const mapAggregate = aggregate.map((product) => {
        product.id = product._id;
        product.categoria = product.categoria._id;
        return product;
      });

      return mapAggregate;
    } catch (error) {
      console.error(error);
    }
  },

  async getSelectProducts(info) {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;
    return await Products.find({
      $and: [{ existencia: { $gte: 0 } }, { deleted: false }],
      nombre: { $not: { $regex: /^TEST \d/ } },
    })
      .select(fields)
      .sort({ nombre: 1 });
  },

  async getProduct(id) {
    try {
      console.log({ id });
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
    const dbProduct = await Products.findById(id);

    if (Boolean(dbProduct.combo)) {
      await restoreStock(dbProduct.productosCombo, dbProduct.existencia);
    }
    try {
      await Products.deleteById(id, userId);
      return 'Producto eliminado.';
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

  async reactivateProduct(id) {
    try {
      const product = await Products.findById(id);

      await product.restore();

      return product;
    } catch (error) {
      handleErrorResponse({ errorMsg: error, message: 'BAD_RESPONSE' });
    }
  },
};
