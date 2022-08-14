const { Products } = require('../products/collection');
const { EOrder } = require('./collection');
const dto = require('./dto');

const selectProducts = {
  existencia: 1,
  nombre: 1,
  precio: 1,
};

module.exports = {
  getPaginatedEOrders: async ({ query = {}, options }) => {
    const {
      docs,
      totalDocs,
      totalPages,
      limit,
      page,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
      pagingCounter,
      meta,
      offset,
    } = await EOrder.paginate(query, options);

    return {
      orders: dto.multiple(docs),
      pageInfo: {
        totalDocs,
        totalPages,
        limit,
        page,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
        pagingCounter,
        meta,
        offset,
      },
    };
  },

  getPaginatedAggregateEOrders: async ({ aggregate, options }) => {
    const orderAggregate = EOrder.aggregate(aggregate);

    const {
      docs,
      totalDocs,
      totalPages,
      limit,
      page,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
      pagingCounter,
      meta,
      offset,
    } = await EOrder.aggregatePaginate(orderAggregate, options);

    return {
      orders: dto.multiple(docs),
      pageInfo: {
        totalDocs,
        totalPages,
        limit,
        page,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
        pagingCounter,
        meta,
        offset,
      },
    };
  },
  checkProductsStockFromEOrders: async (products) => {
    for await (const product of products) {
      const { id, quantity } = product;
      const dbProduct = await Products.findById(id).select(selectProducts);

      if (quantity > dbProduct.existencia) {
        throw new Error(`
        Lo sentimos nos queda poco en stock del producto: ${dbProduct.nombre} - Solo nos quedan ${dbProduct.existencia} unds
       `);
      }
    }
  },

  discountProductsFromEOrder: async (products) => {
    try {
      for await (const product of products) {
        const { id, quantity } = product;
        const dbProduct = await Products.findById(id).select(selectProducts);
        dbProduct.existencia = dbProduct.existencia - quantity;
        await dbProduct.save();
      }
    } catch (error) {
      console.log(error);
    }
  },

  restoreStockProductsFromEOrder: async (products) => {
    try {
      for await (const product of products) {
        const { id, quantity } = product;
        const dbProduct = await Products.findById(id);
        dbProduct.existencia = dbProduct.existencia + quantity;
        await dbProduct.save();
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error no se pudo descontar del stock!');
    }
  },
};
