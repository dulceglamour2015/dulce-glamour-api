const { getISOStringDate } = require('../../utils/formatDate');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');
const { Expense } = require('../expenses/collection');
const { Pedido } = require('../orders/collection');
const { Box } = require('./collection');
const { getPaginateOptions } = require('../../config');
const dto = require('./dto');
const { getPaginatedDocument } = require('../../utils/getPaginatedDocument');

const orderSelectSettlement = {
  id: 1,
  pedido: 1,
  adicional: 1,
  costEnv: 1,
  descuento: 1,
  total: 1,
  tipoVenta: 1,
};

module.exports = {
  getBox: async ({ id }) => {
    try {
      const box = await Box.findById(id);

      return dto.single(box);
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
  getAllBox: async ({ search, page }) => {
    const options = getPaginateOptions({
      page,
      sort: { _id: -1 },
    });
    const queryOptions = { dtoFn: dto.multiple, model: Box, options };

    if (search) {
      const searchOptions = getPaginateOptions({
        ...options,
        sort: { score: { $meta: 'textScore' } },
        projection: { score: { $meta: 'textScore' } },
      });
      const query = { $text: { $search: search } };

      queryOptions.options = searchOptions;
      queryOptions.query = query;
    }

    try {
      const { docs, pageInfo } = await getPaginatedDocument(queryOptions);

      return { docs, pageInfo };
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
  createBox: async ({ input }) => {
    try {
      const newBox = new Box(input);

      await newBox.save();

      return newBox;
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  updateBox: async ({ id, input }) => {
    try {
      return await Box.findByIdAndUpdate(id, input, { new: true });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  deleteBox: async ({ id, userId }) => {
    try {
      await Box.deleteById(id, userId);
      return 'Deleted Succesfully';
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  getSettlement: async ({ filter }) => {
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

    try {
      const orders = await Pedido.find({
        fechaPago: filterDate,
        estado: 'PAGADO',
      }).select(orderSelectSettlement);

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

      const response = {
        income: {
          orders,
          boxes,
        },
        expenses,
      };

      return response;
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
};
