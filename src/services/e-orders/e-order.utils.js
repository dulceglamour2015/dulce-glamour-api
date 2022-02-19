const { Products } = require('../products/collection');

const selectProducts = {
  existencia: 1,
  nombre: 1,
  precio: 1,
};

module.exports = {
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
