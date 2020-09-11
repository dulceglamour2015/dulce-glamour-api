const { Pedido } = require('../../database/Pedido');
const { Producto } = require('../../database/Producto');

module.exports = {
  Query: {
    mejoresClientes: async () => {
      try {
        return await Pedido.aggregate([
          { $match: { estado: 'PAGADO' } },
          {
            $group: {
              _id: '$cliente',
              total: { $sum: '$total' },
            },
          },
          {
            $lookup: {
              from: 'clientes',
              localField: '_id',
              foreignField: '_id',
              as: 'cliente',
            },
          },
          { $limit: 10 },
          { $sort: { total: -1 } },
        ]);
      } catch (error) {
        throw new Error('No se pudo obtener a los mejores clientes!');
      }
    },
    mejoresVendedores: async () => {
      try {
        return await Pedido.aggregate([
          { $match: { estado: 'PAGADO' } },
          {
            $group: {
              _id: '$vendedor',
              total: { $sum: '$total' },
            },
          },
          {
            $lookup: {
              from: 'usuarios',
              localField: '_id',
              foreignField: '_id',
              as: 'vendedor',
            },
          },
          { $limit: 3 },
          { $sort: { total: -1 } },
        ]);
      } catch (error) {
        throw new Error('No se pudo obtener a los mejores vendedores!');
      }
    },

    buscarProducto: async (_, { texto }) => {
      try {
        return await Producto.find({
          $text: { $search: texto },
        }).limit(10);
      } catch (error) {
        throw new Error(`Error | ${error.message}`);
      }
    },
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
              ped.creado.getDate() === day &&
              ped.creado.getMonth() === month &&
              ped.creado.getFullYear() === year
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
    },
  },
};
