const { Pedido } = require('../../database/Pedido');
const { Usuario } = require('../../database/Usuario');
const { Producto } = require('../../database/Producto');
const { Cliente } = require('../../database/Cliente');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');
const { paginatedResults } = require('../../utils/pagination');

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
    },
  },
  Query: {
    obtenerPedidos: async (_, { offset }, { current }, info) => {
      const query = { estado: 'PENDIENTE' };
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;

      if (current.rol === 'ADMINISTRADOR') {
        try {
          const { results } = await paginatedResults(
            Pedido,
            1000,
            offset,
            query
          );

          return results;
        } catch (error) {
          throw new Error('❌Error! ❌');
        }
      }

      try {
        const pedidos = await Pedido.find({
          estado: 'PENDIENTE',
          vendedor: current.id,
        })
          .select(fields)
          .sort({ _id: -1 });
        return pedidos;
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

    pedidosPagados: async (_, __, { current }, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;

      if (current.rol === 'ADMINISTRADOR') {
        try {
          return await Pedido.find({ estado: 'PAGADO' })
            .select(fields)
            .sort({ _id: -1 });
        } catch (error) {
          throw new Error('❌Error! ❌');
        }
      }

      try {
        return await Pedido.find({ estado: 'PAGADO', vendedor: current.id })
          .select(fields)
          .sort({ _id: -1 });
      } catch (error) {
        throw new Error('❌Error! ❌');
      }
    },
    pedidosDespachados: async (_, __, { current }, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;

      if (current.rol === 'ADMINISTRADOR') {
        try {
          return await Pedido.find({ estado: 'DESPACHADO' })
            .select(fields)
            .sort({ _id: -1 });
        } catch (error) {
          throw new Error('❌Error! ❌');
        }
      }
      try {
        return await Pedido.find({ estado: 'DESPACHADO', vendedor: current.id })
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
      if (!clienteExiste) throw new Error('Cliente no existe');

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

          if (input.estado === 'PAGADO') {
            producto.existencia = producto.existencia - articulo.cantidad;
            await producto.save();
          }
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
