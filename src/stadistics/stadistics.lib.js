const { DateTime } = require('luxon');
const { getFullDateInNumber } = require('../utils/formatDate');

module.exports = {
  getAggregateSellerOrderOpts: ({ match }) => {
    return [
      match,
      {
        $group: {
          _id: '$vendedor',
          total: { $sum: '$total' },
          cantPedido: { $sum: 1 },
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
      {
        $match: {
          $or: [
            { 'vendedor.rol': 'USUARIO' },
            { 'vendedor.rol': 'ADMINISTRADOR' },
          ],
        },
      },
      { $unwind: '$vendedor' },
      { $sort: { total: -1 } },
    ];
  },
  getAggregateClientsOrderOpts: ({ match }) => {
    return [
      match,
      {
        $group: {
          _id: '$cliente',
          total: { $sum: '$total' },
          cantPedido: { $sum: 1 },
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
      { $unwind: '$cliente' },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ];
  },

  getDateToQuery: (date) => {
    let dateToQuery;
    const { year, month, day } = getFullDateInNumber();
    if (date) {
      const filterDate = DateTime.fromISO(date).setZone('America/Lima');
      dateToQuery = {
        year: filterDate.year,
        month: filterDate.month,
        day: filterDate.day,
      };
    } else {
      dateToQuery = {
        year,
        month,
        day,
      };
    }

    return dateToQuery;
  },

  getTotalAndCountOrders: ({ orders, year, month, day }) => {
    const filterOrders = orders.filter((order) => {
      const formatDate = DateTime.fromJSDate(order.fechaPago, {
        zone: 'America/Guayaquil',
      });

      return (
        formatDate.year === year &&
        formatDate.month === month &&
        formatDate.day === day
      );
    });
    const total = filterOrders.reduce(
      (newTotal, ped) => (newTotal += ped.total),
      0
    );

    return {
      total,
      count: filterOrders.length,
      orders: filterOrders,
    };
  },
};
