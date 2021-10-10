const { Box } = require('./box.model');
const { Pedido } = require('../orders/orders.model');
const { Expense } = require('../expenses/expense.model');
const { getISOStringDate } = require('../utils/formatDate');

const orderSelectSettlement = {
  id: 1,
  pedido: 1,
  adicional: 1,
  costEnv: 1,
  descuento: 1,
  total: 1,
};

module.exports = {
  Query: {
    getBox: async (_, { id }) => {
      try {
        return await Box.findById(id);
      } catch (error) {
        throw new Error('Cannot get box');
      }
    },
    getAllBox: async () => {
      try {
        return await Box.find();
      } catch (error) {
        throw new Error('Cannot get Boxes');
      }
    },
  },

  Mutation: {
    createBox: async (_, { input }) => {
      try {
        const newBox = new Box(input);
        newBox.id = newBox._id;

        await newBox.save();

        return newBox;
      } catch (error) {
        throw new Error('Cannot create box');
      }
    },
    updateBox: async (_, { id, input }) => {
      try {
        return await Box.findByIdAndUpdate(id, input, { new: true });
      } catch (error) {
        throw new Error('Cannot update box');
      }
    },
    deleteBox: async (_, { id }) => {
      try {
        await Box.findByIdAndDelete(id);
        return 'Deleted Succesfully';
      } catch (error) {
        throw new Error('Cannot delete Box');
      }
    },
    getSettlement: async (_, filter) => {
      const from = getISOStringDate({
        date: filter.from,
        hours: 0,
        min: 0,
        sec: 0,
        ms: 0,
      });
      const to = getISOStringDate({
        date: filter.to,
        hours: 23,
        min: 59,
        sec: 59,
        ms: 999,
      });
      const filterDate = {
        $gte: new Date(from),
        $lte: new Date(to),
      };

      const orders = await Pedido.find({ fechaPago: filterDate }).select(
        orderSelectSettlement
      );
      const boxes = await Box.find({
        date: {
          $gte: filter.from,
          $lte: filter.to,
        },
      });

      const expenses = await Expense.find({
        registroDate: {
          $gte: filter.from,
          $lte: filter.to,
        },
      });

      return {
        income: {
          orders,
          boxes,
        },
        expenses,
      };
    },
  },
};
