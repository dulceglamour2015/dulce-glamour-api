const { Pedido } = require('../../database/Pedido');
const { Producto } = require('../../database/Producto');

module.exports = {
  Query: {
    mejoresClientes: async () => {
      try {
        const result = await Pedido.aggregate([
          { $match: { estado: 'PAGADO' } },
          {
            $group: {
              _id: '$cliente',
              total: { $sum: '$total' }
            }
          },
          {
            $lookup: {
              from: 'clientes',
              localField: '_id',
              foreignField: '_id',
              as: 'cliente'
            }
          },
          { $sort: { total: -1 } }
        ]);

        const match = result
          .filter((e) => e.total >= 200)
          .sort()
          .slice(5, 10);

        return match;
      } catch (error) {
        throw new Error('No se pudo obtener a los mejores clientes!');
      }
    },
    mejoresVendedores: async () => {
      try {
        const result = await Pedido.aggregate([
          {
            $group: {
              _id: '$vendedor',
              total: { $sum: '$total' },
              cantPedido: { $sum: 1 }
            }
          },
          {
            $lookup: {
              from: 'usuarios',
              localField: '_id',
              foreignField: '_id',
              as: 'vendedor'
            }
          },
          { $unwind: '$vendedor' },
          { $sort: { total: -1 } }
        ]);

        return result;
      } catch (error) {
        throw new Error('No se pudo obtener a los mejores vendedores!');
      }
    },

    productivityUser: async (_, __, { current }) => {
      let queryObj = {};
      const startOfDay = new Date(
        new Date().setUTCHours(0, 0, 0, 0)
      ).toISOString();
      const endOfDay = new Date(
        new Date().setUTCHours(23, 59, 59, 999)
      ).toISOString();

      queryObj.createdAt = {
        $gte: startOfDay,
        $lt: endOfDay
      };

      queryObj.estado = 'PAGADO';
      queryObj.vendedor = current.id;

      const queryTotalOrder = await Pedido.find(queryObj);
      const total = queryTotalOrder.reduce(
        (newTotal, ped) => (newTotal += ped.total),
        0
      );
      return {
        total,
        count: queryTotalOrder.length
      };
    },

    buscarProducto: async (_, { texto }) => {
      try {
        return await Producto.find({
          $text: { $search: texto }
        }).limit(10);
      } catch (error) {
        throw new Error(`Error | ${error.message}`);
      }
    }
  },

  Mutation: {
    totalDeVentas: async (_, { day, month, year }) => {
      try {
        const res = await Pedido.find({ estado: 'PAGADO' });

        const pedidos = res.filter((ped) => {
          if (
            ped.creado.getDate() === day &&
            ped.creado.getMonth() === month &&
            ped.creado.getFullYear() === year
          ) {
            return ped;
          } else {
            return false;
          }
        });
        const totalVentas = res
          .filter((ped) => {
            if (
              ped.createdAt.getDate() === day &&
              ped.createdAt.getMonth() === month &&
              ped.createdAt.getFullYear() === year
            ) {
              return true;
            } else {
              return false;
            }
          })
          .reduce((nuevoTotal, pedido) => (nuevoTotal += pedido.total), 0);

        const total = totalVentas.toFixed(2);

        return { total, pedidos };
      } catch (error) {
        throw new Error('💥ERROR💥');
      }
    }
  }
};
