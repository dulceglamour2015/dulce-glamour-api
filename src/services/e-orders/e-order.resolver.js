const { EOrder } = require('./e-order-model');
const {
  checkProductsStockFromEOrders,
  discountProductsFromEOrder,
  restoreStockProductsFromEOrder,
} = require('./e-order.utils');

module.exports = {
  Query: {
    allEOrder: async (_, { status }) => {
      let filter = {};
      if (status) {
        filter.status = status;
      }

      try {
        const eOrders = await EOrder.find(filter).sort({ _id: -1 });

        return eOrders.map(({ _doc: { _id, ...order } }) => ({
          id: _id,
          ...order,
        }));
      } catch (error) {
        console.log(error);
        throw new Error('No se pudo obtener los pedidos del e-commerce');
      }
    },

    getEOrder: async (_, { id }) => {
      try {
        return await EOrder.findById(id);
      } catch (error) {
        throw new Error('Error no se pudo obtener el pedido.');
      }
    },
  },
  Mutation: {
    addEOrder: async (_, { input }) => {
      await checkProductsStockFromEOrders(input.lineProducts);
      await discountProductsFromEOrder(input.lineProducts);
      try {
        const eorder = new EOrder({ status: 'PENDING', ...input });
        await eorder.save();

        return { id: eorder._doc._id, ...eorder._doc };
      } catch (error) {
        console.log(error);
        throw new Error('Error! No se ha podrido registrar el pedido');
      }
    },

    updateEOrder: async (_, { id, input, prevEOrder }) => {
      try {
        await checkProductsStockFromEOrders(input.lineProducts);
        await restoreStockProductsFromEOrder(prevEOrder);
        await discountProductsFromEOrder(input.lineProducts);
        return await EOrder.findByIdAndUpdate(id, input, { new: true });
      } catch (error) {
        throw new Error('No se pudo actualizar el pedido.');
      }
    },

    updateEOrderStatus: async (_, { id, status }) => {
      try {
        return await EOrder.findByIdAndUpdate(id, { status }, { new: true });
      } catch (error) {
        console.error(error);
        throw new Error('No se pudo actualizar el estado del pedido.');
      }
    },

    deleteEOrder: async (_, { id }) => {
      const dbEOrder = await EOrder.findById(id);
      if (dbEOrder) {
        try {
          await restoreStockProductsFromEOrder(dbEOrder.lineProducts);
          await EOrder.findByIdAndDelete(id);
          return 'Pedido Eliminado';
        } catch (error) {
          console.error(error);
          throw new Error('No se pudo eliminar el pedido.');
        }
      }
    },
  },
};