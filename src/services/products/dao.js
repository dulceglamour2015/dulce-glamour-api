const dto = require('./dto');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');
const {
  getProductByFilter,
  saveProduct,
  discountStock,
  restoreStock,
  setProductByFilter,
  checkProductStock,
  getPaginatedProducts,
  getPaginatedAggregateProducts,
  getFilterToShoppingProducts,
} = require('./lib');
const { Products } = require('./collection');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');
const getPaginateOptions = require('../../config/paginationsOptions');
const mongoose = require('mongoose');

module.exports = {
  async getAllProducts({ page, search }) {
    const options = getPaginateOptions({ page, limit: 10 });
    const query = {
      $and: [{ existencia: { $gte: 0 } }, { deleted: false }],
    };
    try {
      if (search) {
        const aggregate = [
          {
            $search: {
              index: 'products_search',
              text: {
                query: search,
                path: 'nombre',
              },
            },
          },
          {
            $match: {
              deleted: false,
            },
          },
        ];
        const resAggregate = await getPaginatedAggregateProducts({
          aggregate,
          options: { page, limit: 10 },
        });

        return resAggregate;
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
        const aggregate = [
          {
            $search: {
              index: 'products_search',
              text: {
                query: search,
                path: 'nombre',
              },
            },
          },
          {
            $match: query,
          },
        ];
        const resAggregate = await getPaginatedAggregateProducts({
          aggregate,
          options: { page, limit: 10 },
        });

        return resAggregate;
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

  async getShoppingProductsSearch({ search }) {
    if (!search) return [];

    try {
      const aggregate = [
        {
          $search: {
            index: 'products_search',
            text: {
              query: search,
              path: 'nombre',
            },
          },
        },
        {
          $match: {
            deleted: false,
            ecommerce: true,
            oferta: false,
          },
        },
      ];
      const res = await Products.aggregate(aggregate);

      return dto.multiple(res);
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  async getShoppingProducts({ input }) {
    const { slug, where, oferta, page } = input;
    const options = getPaginateOptions({
      page,
      limit: 12,
      sort: { nombre: 1 },
    });
    const query = getFilterToShoppingProducts({ slug, where, oferta });

    try {
      const res = await getPaginatedProducts({ query, options });

      return res;
    } catch (error) {
      handleErrorResponse({ errorMsg: error, message: 'BAD_REQUEST' });
    }
  },

  async getOffersProducts() {
    try {
      const offersProducts = await Products.find({
        oferta: true,
        deleted: false,
        ecommerce: true,
      }).sort({ nombre: 1 });

      return offersProducts;
    } catch (error) {
      handleErrorResponse({ errorMsg: error, message: 'BAD_REQUEST' });
    }
  },
  async getLatestProducts() {
    try {
      const latestProducts = await Products.find({
        deleted: false,
        ecommerce: true,
      })
        .limit(15)
        .sort({ _id: -1 });

      return latestProducts;
    } catch (error) {
      handleErrorResponse({ errorMsg: error, message: 'BAD_REQUEST' });
    }
  },

  async getRelatedProducts({ categoryId, productId }) {
    try {
      const productToRelated = await Products.findById(productId);

      if (productToRelated) {
        const ramdonProducts = await Products.aggregate([
          {
            $match: {
              $and: [{ deleted: false, ecommerce: true }],
            },
          },
          {
            $match: {
              categoria: mongoose.Types.ObjectId(categoryId),
            },
          },
          {
            $match: {
              _id: { $ne: productId },
            },
          },
          {
            $match: { precio: { $gt: productToRelated.precio } },
          },
          { $sample: { size: 4 } },
        ]);

        return ramdonProducts.map((product) => {
          product.id = product._id;

          return product;
        });
      }
    } catch (error) {
      handleErrorResponse({ errorMsg: error, message: 'BAD_REQUEST' });
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
        {
          $project: {
            nombre: 1,
            existencia: 1,
            precio: 1,
            precioCompra: 1,
            precio: 1,
          },
        },
      ]);

      const res = aggregate
        .map((product) => ({
          id: product._id,
          nombre: product.nombre,
          stock: product.existencia,
          pv: product.precio,
          pc: product.precioCompra,
          vn: product.existencia * product.precioCompra,
          vf: product.existencia * product.precio,
        }))
        .sort((a, b) => b.stock - a.stock);

      const neto = res.reduce((acc, item) => (acc += item.vn), 0);
      const futuro = res.reduce((acc, item) => (acc += item.vf), 0);
      const totalProducts = res.reduce((acc, item) => (acc += item.stock), 0);

      return { inventory: res, neto, futuro, totalProducts };
    } catch (error) {
      handleErrorResponse({ errorMsg: error, message: 'BAD_REQUEST' });
    }
  },

  async getSelectProducts(info) {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;
    try {
      const products = await Products.find({
        $and: [{ existencia: { $gte: 0 } }, { deleted: false }],
      })
        .select(fields)
        .sort({ nombre: 1 });

      return products;
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  async getProduct(id) {
    try {
      const product = await Products.findById(id);
      return product;
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
      handleErrorResponse({ errorMsg: error, message: 'BAD_REQUEST' });
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
      handleErrorResponse({ errorMsg: error, message: 'BAD_REQUEST' });
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
