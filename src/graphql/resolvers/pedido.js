const { Pedido } = require('../../database/Pedido');
const { Usuario } = require('../../database/Usuario');
// const { Producto } = require('../../database/Producto');
const { Cliente } = require('../../database/Cliente');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');
const {
  getOrders,
  getOrder,
  getPaidOrders,
  getDispatchOrders,
  addOrder,
  setOrder,
  deleteOrder,
  setStatusOrder
} = require('../../services/ordersService');

module.exports = {
  Pedido: {
    vendedor: async (parent, _args, { loader }, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;

      return await Usuario.findById(parent.vendedor).select(fields);
    },
    cliente: async (parent, _args, _context, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;

      return await Cliente.findById(parent.cliente).select(fields);
    }
  },
  Query: {
    obtenerPedidos: async (_, { page }, { current }, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;

      return await getOrders(current, fields, page);
    },
    obtenerPedido: async (_, { id }) => {
      return await getOrder(id);
    },

    totalPedidos: async (_, __, ___) => {
      try {
        return await Pedido.countDocuments();
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
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
    eliminarPedido: async (_, { id }) => {
      return await deleteOrder(id);
    }
  }
};
