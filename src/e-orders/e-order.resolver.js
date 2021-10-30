const { EOrder } = require('./e-order-model');

module.exports = {
  Query: {
    allEOrder: async () => {
      try {
        const eOrders = await EOrder.find();

        return eOrders.map(({ _doc: { _id, ...order } }) => ({
          id: _id,
          ...order,
        }));
      } catch (error) {
        throw new Error('No se pudo obtener los pedidos del e-commerce');
      }
    },
  },
  Mutation: {
    addEOrder: async (_, { input }) => {
      try {
        const eorder = new EOrder({ status: 'PENDING', ...input });
        await eorder.save();

        return { id: eorder._doc._id, ...eorder._doc };
      } catch (error) {
        console.log(error);
        throw new Error('Error! No se ha podrido registrar el pedido');
      }
    },
  },
};
