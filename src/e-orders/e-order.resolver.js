const { EOrder } = require('./e-order-model');

module.exports = {
  Query: {},
  Mutation: {
    addEOrder: async (_, { input }) => {
      console.log(input);
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
