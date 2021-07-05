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
    obtenerPedido: async (_, { id }) => {
      return await getOrder(id);
    },

    totalPedidos: async () => {
      return await totalOrdersCount();
    },

    pedidosPagados: async (_, __, { current }, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;

      return await getPaidOrders(current, fields);
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
    nuevoPedido: async (_, { input }, { current }) => {
      return await addOrder(input, current);
    },
    actualizarPedido: async (_, { id, input, prevOrder }) => {
      return await setOrderWithStock(input, prevOrder, id);
    },
    updateOrder: async (_, { id, input }) => {
      return await setOrderWithoutStock(input, id);
    },
    actualizarEstadoPedido: async (_, { id, input }) => {
      return await setStatusOrder({ input, id });
    },
    actualizarPagoPedido: async (_, { id, input }) => {
      return await setPaidOrder(input, id);
    },
    eliminarPedido: async (_, { id }) => {
      return await deleteOrder(id);
    },
    searchOrders: async (_, { search, page }, ctx, info) => {
      return await searchOrders(search, page, ctx);
    },
  },
};
