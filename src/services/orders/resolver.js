const model = require('./dao');
const clientModel = require('../clients/model');
const userModel = require('../users/model');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');

module.exports = {
  Pedido: {
    vendedor: async (parent, _args, { loader }) => {
      return await userModel.loaderUsersOrder(parent.vendedor, loader);
    },
    cliente: async (parent, _args, { loader }) => {
      return await clientModel.loaderClientsOrders(parent.cliente, loader);
    },
  },
  Query: {
    obtenerPedidos: async (_, { page = 1, type }, { current }) => {
      return await model.getOrders({ current, page, type });
    },
    paidOrders: async (_, { page = 1, type }, { current }) => {
      return await model.getPaidOrders({ current, page, type });
    },
    ordersToAttend: async (_, { page = 1 }) => {
      return await model.getOrdersToAttend(page);
    },
    ordersToPackIn: async (_, { page = 1 }) => {
      return await model.getOrdersToPackIn(page);
    },
    ordersToSend: async (_, { page = 1 }) => {
      return await model.getOrdersToSend(page);
    },
    ordersDispatched: async (_, { page = 1 }) => {
      return await model.getOrdersDispatched(page);
    },
    obtenerPedido: async (_, { id }) => {
      const order = await model.getOrder(id);
      return order;
    },

    totalPedidos: async () => {
      return await model.totalOrdersCount();
    },

    pedidosDespachados: async (_, __, { current }, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;

      return await model.getDispatchOrders(current, fields);
    },
    canceledOrders: async (_, __, ___, info) => {
      return await model.getCanceledOrders(info);
    },
    searchOrders: async (_, { search }) => {
      return await model.searchOrdersService(search);
    },
  },
  Mutation: {
    createOrder: async (_, { input }, { current }) => {
      return await model.addOrder(input, current);
    },
    updateOrderWithStock: async (_, { id, input, prevOrder }) => {
      return await model.setOrderWithStock({ input, prev: prevOrder, id });
    },
    updateOrderWithoutStock: async (_, { id, input }) => {
      return await model.setOrderWithoutStock(input, id);
    },
    updateStatusOrder: async (_, { id, input }) => {
      return await model.setStatusOrder({ input, id });
    },
    updatePaymentOrder: async (_, { id, input }) => {
      return await model.setPaidOrder(input, id);
    },
    updateAttendOrder: async (_, { id }, { current }) => {
      return await model.setAttendOrder(id, current);
    },
    updatePackinOrder: async (_, { id }, { current }) => {
      return await model.setPackinOrder(id, current);
    },
    updateSendOrder: async (_, { id }) => {
      return await model.setToSendOrder(id);
    },
    removeOrder: async (_, { id }) => {
      return await model.deleteOrder(id);
    },
  },
};
