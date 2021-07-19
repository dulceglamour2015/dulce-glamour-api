const {
  getOrders,
  getOrder,
  getPaidOrders,
  getDispatchOrders,
  addOrder,
  setOrderWithoutStock,
  deleteOrder,
  setStatusOrder,
  setPaidOrder,
  searchOrders,
  getOrderClient,
  totalOrdersCount,
  setOrderWithStock,
  getCanceledOrders,
  getOrdersToAttend,
  setAttendOrder,
  getOrdersToPackIn,
  setPackinOrder,
  setToSendOrder,
  getOrdersToSend,
  getOrdersDispatched,
} = require('./orders.service');
const { getMongooseSelectionFromReq } = require('../utils/selectFields');
const { orderSeller } = require('../users/users.service');

module.exports = {
  Pedido: {
    vendedor: async (parent, _args, { loader }) => {
      return await orderSeller(parent.vendedor, loader);
    },
    cliente: async (parent, _args, { loader }) => {
      return await getOrderClient(parent.cliente, loader);
    },
  },
  Query: {
    obtenerPedidos: async (_, { page = 1 }, { current }) => {
      return await getOrders(current, page);
    },
    paidOrders: async (_, { page = 1 }, { current }) => {
      return await getPaidOrders(current, page);
    },
    ordersToAttend: async (_, { page = 1 }) => {
      return await getOrdersToAttend(page);
    },
    ordersToPackIn: async (_, { page = 1 }) => {
      return await getOrdersToPackIn(page);
    },
    ordersToSend: async (_, { page = 1 }) => {
      return await getOrdersToSend(page);
    },
    ordersDispatched: async (_, { page = 1 }) => {
      return await getOrdersDispatched(page);
    },
    obtenerPedido: async (_, { id }) => {
      return await getOrder(id);
    },

    totalPedidos: async () => {
      return await totalOrdersCount();
    },

    pedidosDespachados: async (_, __, { current }, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;

      return await getDispatchOrders(current, fields);
    },
    canceledOrders: async (_, __, ___, info) => {
      return await getCanceledOrders(info);
    },
  },
  Mutation: {
    createOrder: async (_, { input }, { current }) => {
      return await addOrder(input, current);
    },
    updateOrderWithStock: async (_, { id, input, prevOrder }) => {
      return await setOrderWithStock(input, prevOrder, id);
    },
    updateOrderWithoutStock: async (_, { id, input }) => {
      return await setOrderWithoutStock(input, id);
    },
    updateStatusOrder: async (_, { id, input }) => {
      return await setStatusOrder({ input, id });
    },
    updatePaymentOrder: async (_, { id, input }) => {
      return await setPaidOrder(input, id);
    },
    updateAttendOrder: async (_, { id }, { current }) => {
      return await setAttendOrder(id, current);
    },
    updatePackinOrder: async (_, { id }, { current }) => {
      return await setPackinOrder(id, current);
    },
    updateSendOrder: async (_, { id }) => {
      return await setToSendOrder(id);
    },
    removeOrder: async (_, { id }) => {
      return await deleteOrder(id);
    },
    searchOrders: async (_, { search }) => {
      return await searchOrders(search);
    },
  },
};
