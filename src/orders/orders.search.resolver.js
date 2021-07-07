const { Pedido } = require('./orders.model');
const {
  getAggregateClient,
  getAggregateClientFilter,
  getAggregateSellerFilter,
  getAggregateSeller,
  getUserProductivity,
  getCurrentProductivity,
} = require('./orders.search.service');

module.exports = {
  Query: {
    productivityUser: async (_, { id, withOutId }, { current }) => {
      if (withOutId) {
        return await getCurrentProductivity();
      }
      return await getUserProductivity({ id, current });
    },

    mejoresClientes: async (_, { filter }) => {
      if (filter && filter.from && filter.to) {
        return await getAggregateClientFilter(filter);
      }

      return await getAggregateClient();
    },
    mejoresVendedores: async (_, { filter }) => {
      if (filter && filter.from && filter.to) {
        return await getAggregateSellerFilter(filter);
      }

      return await getAggregateSeller();
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
    },
  },
};
