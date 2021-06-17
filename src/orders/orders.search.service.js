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
module.exports = {
  getAggregateClient,
  getAggregateClientFilter,
  getAggregateSeller,
  getAggregateSellerFilter,
};
