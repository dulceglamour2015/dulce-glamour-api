const { getMongooseSelectionFromReq } = require('../../utils/selectFields');
const {
  getOrders,
  getOrder,
  getPaidOrders,
  getDispatchOrders,
  addOrder,
  setOrder,
  deleteOrder,
  setStatusOrder,
  setPaidOrder,
  searchOrders,
  getOrderSeller,
  getOrderClient,
  totalOrdersCount
} = require('../../services/ordersService');

module.exports = {
  Pedido: {
    vendedor: async (parent, _args, { loader }) => {
      return await getOrderSeller(parent.vendedor, loader);
    },
    cliente: async (parent, _args, { loader }) => {
      return await getOrderClient(parent.cliente, loader);
    }
  },
  Query: {
    obtenerPedidos: async (_, { page = 1 }, { current }, info) => {
      return await getOrders(current, page);
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
    }
  },
  Mutation: {
    nuevoPedido: async (_, { input }, { current }) => {
      return await addOrder(input, current);
    },
    actualizarPedido: async (_, { id, input, prevOrder }) => {
      return await setOrder(input, prevOrder, id);
    },
    actualizarEstadoPedido: async (_, { id, status }) => {
      return await setStatusOrder(status, id);
    },
    actualizarPagoPedido: async (_, { id, input }) => {
      return await setPaidOrder(input, id);
    },
    eliminarPedido: async (_, { id }) => {
      return await deleteOrder(id);
    },
    searchOrders: async (_, { search, page }, ctx, info) => {
      return await searchOrders(search, page, ctx);
    }
  }
};
