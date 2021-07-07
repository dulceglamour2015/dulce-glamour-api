const { DateTime } = require('luxon');
const { Pedido } = require('./orders.model');

async function getAggregateClient() {
  try {
    return await Pedido.aggregate([
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
      { $limit: 8 },
    ]);
  } catch (error) {
    throw new Error('No se pudo obtener a los mejores clientes!');
  }
}

async function getAggregateClientFilter(filter) {
  const { from, to } = filter;
  const fromDate = new Date(`${to.year}-${to.month}-${to.day}`).toISOString();
  const toDate = new Date(
    `${from.year}-${from.month}-${from.day}`
  ).toISOString();

  const match = {
    $match: {
      createdAt: {
        $gte: new Date(toDate),
        $lte: new Date(fromDate),
      },
    },
  };

  try {
    return await Pedido.aggregate([
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
      { $limit: 8 },
    ]);
  } catch (error) {
    console.error(error.message);
    throw new Error('No se pudo obtener a los mejores clientes!');
  }
}

async function getAggregateSeller() {
  try {
    return await Pedido.aggregate([
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
      { $unwind: '$vendedor' },
      { $sort: { total: -1 } },
    ]);
  } catch (error) {
    throw new Error('No se pudo obtener a los mejores vendedores!');
  }
}

async function getAggregateSellerFilter(filter) {
  const { from, to } = filter;
  const fromDate = new Date(`${to.year}-${to.month}-${to.day}`).toISOString();
  const toDate = new Date(
    `${from.year}-${from.month}-${from.day}`
  ).toISOString();

  const match = {
    $match: {
      createdAt: {
        $gte: new Date(toDate),
        $lte: new Date(fromDate),
      },
    },
  };

  try {
    return await Pedido.aggregate([
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
      { $unwind: '$vendedor' },
      { $sort: { total: -1 } },
    ]);
  } catch (error) {
    throw new Error('No se pudo obtener a los mejores vendedores!');
  }
}

function getFullDateInNumber() {
  const date = DateTime.now().setZone('America/Guayaquil');
  const { year, day, month } = date;

  return { year, day, month };
}

function getTotalAndCountOrders({ orders, year, month, day }) {
  const filterOrders = orders.filter((order) => {
    const formatDate = DateTime.fromJSDate(order.createdAt, {
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
  };
}

async function getUserProductivity({ id, current }) {
  const { year, month, day } = getFullDateInNumber();

  const orders = await Pedido.find(
    {
      estado: 'PAGADO',
      vendedor: id ? id : current.id,
    },
    'createdAt total',
    { sort: { _id: -1 } }
  );
  const { total, count } = getTotalAndCountOrders({ orders, year, month, day });

  return {
    total,
    count,
  };
}

async function getCurrentProductivity() {
  const { year, month, day } = getFullDateInNumber();

  const orders = await Pedido.find(
    {
      estado: 'PAGADO',
    },
    'createdAt total',
    { sort: { _id: -1 } }
  );
  const { total, count } = getTotalAndCountOrders({ orders, year, month, day });

  return {
    total,
    count,
  };
}

module.exports = {
  getAggregateClient,
  getAggregateClientFilter,
  getAggregateSeller,
  getAggregateSellerFilter,
  getUserProductivity,
  getCurrentProductivity,
};
