const { Pedido } = require('../../database/Pedido');
const { Usuario } = require('../../database/Usuario');
const { Producto } = require('../../database/Producto');
const { Cliente } = require('../../database/Cliente');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');
const { paginatedResults } = require('../../utils/pagination');

module.exports = {
  Pedido: {
    vendedor: async (parent, _args, { loader }) => {
      return await Usuario.findById(parent.vendedor);
    },
    cliente: async (parent, _args, _context) => {
      return await Cliente.findById(parent.cliente);
    },
  },
  Query: {
    obtenerPedidos: async (_, { offset }, context, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;

      try {
        const result = await paginatedResults(Pedido, 150, offset);
        return result.results;
        // const orders = await Pedido.find({ estado: 'PENDIENTE' })
        //   .select(fields)
        //   .sort({ _id: -1 });

        // return orders;
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },
    obtenerPedidosVendedor: async (_, {}, ctx) => {
      try {
        return await Pedido.find({ vendedor: ctx.usuario.id }).sort({
          _id: -1,
        });
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },
    obtenerPedido: async (_, { id }, ctx) => {
      // Si el pedido existe o no
      try {
        const pedido = await Pedido.findById(id);

        return pedido;
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },
    obtenerPedidosEstado: async (_, { estado }, ctx) => {
      try {
        return await Pedido.find({ vendedor: ctx.usuario.payload.id, estado });
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },

    totalPedidos: async (_, __, ___) => {
      try {
        return await Pedido.countDocuments();
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },

    pedidosPagados: async (_, { offset }, ___, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;
      try {
        return await Pedido.find({ estado: 'PAGADO' })
          .select(fields)
          .sort({ _id: -1 });
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },
    pedidosDespachados: async (_, { offset }, ___, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;
      try {
        return await Producto.find({ estado: 'DESPACHADO' })
          .select(fields)
          .sort({ _id: -1 });
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },
  },
  Mutation: {
    nuevoPedido: async (_, { input }, ctx) => {
      const { cliente } = input;
      let clienteExiste = await Cliente.findById(cliente);
      if (!clienteExiste) throw new Error('Ese cliente no existe');

      for await (const articulo of input.pedido) {
        const { id } = articulo;
        const producto = await Producto.findById(id);
        if (articulo.cantidad > producto.existencia) {
          throw new Error(
            `El articulo: ${producto.nombre} excede la cantidad disponible`
          );
        }
        await producto.save();
      }
      // input.total = input.total + input.costEnv;
      const nuevoPedido = new Pedido(input);
      nuevoPedido.id = nuevoPedido._id;
      nuevoPedido.vendedor = ctx.current.id;
      await nuevoPedido.save();
      return nuevoPedido;
    },
    actualizarPedido: async (_, { id, input }) => {
      const existePedido = await Pedido.findById(id);
      if (!existePedido) {
        throw new Error('❌Error! ❌');
      }
      if (input.pedido) {
        for await (const articulo of input.pedido) {
          const { id } = articulo;
          const producto = await Producto.findById(id);

          if (articulo.cantidad > producto.existencia) {
            throw new Error(
              `El articulo: ${producto.nombre} excede la cantidad disponible`
            );
          }
          if (input.estado === 'PAGADO') {
            producto.existencia = producto.existencia - articulo.cantidad;
          }

          await producto.save();
        }
      }

      try {
        return await Pedido.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
      } catch (error) {
        throw new Error(error.message);
      }
    },
    eliminarPedido: async (_, { id }) => {
      try {
        await Pedido.findOneAndDelete({ _id: id });
        return 'Pedido Eliminado';
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },
  },
};
