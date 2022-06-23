const model = require('./model');
const clientModel = require('../clients/model');
const userModel = require('../users/model');

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
    getOrders: async (
      _,
      { page = 1, type, status, filters },
      { current, req }
    ) => {
      return await model.getOrders({ current, page, type, status, filters });
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
    canceledOrders: async (_, __, ___, info) => {
      return await model.getCanceledOrders(info);
    },
    searchOrders: async (_, { search }) => {
      return await model.searchOrders(search);
    },
  },
  Mutation: {
    createOrder: async (_, { input }, { current }) => {
      return await model.addOrder(input, current);
    },
    updateOrderWithStock: async (_, { id, input }) => {
      return await model.setOrderWithStock({ input, id });
    },
    updateOrderWithoutStock: async (_, { id, input }) => {
      return await model.setOrderWithoutStock(input, id);
    },
    updateStatusOrder: async (_, { id, input }) => {
      return await model.setStatusOrder(input, id);
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
