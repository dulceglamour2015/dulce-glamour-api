const { DateTime } = require('luxon');
const { Usuario } = require('../users/users.model');
const { getFullDateInNumber } = require('../utils/formatDate');
const { getTotalAndCountOrders } = require('./orders.lib');
const { Pedido } = require('./orders.model');

async function getAggregateClient() {
  try {
    return await Pedido.aggregate([
      {
        $match: {
          estado: 'PAGADO',
        },
      },
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

  const match = {
    $match: {
      estado: 'PAGADO',
      createdAt: {
        $gte: new Date(from),
        $lte: new Date(to),
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
        $match: {
          estado: 'PAGADO',
        },
      },
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

  const match = {
    $match: {
      createdAt: {
        $gte: new Date(from),
        $lte: new Date(to),
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

function getDateToQuery(date) {
  let dateToQuery;
  const { year, month, day } = getFullDateInNumber();
  if (date) {
    const filterDate = DateTime.fromISO(date);
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
}

async function getUserOrders({ date }) {
  try {
    const res = await Usuario.aggregate([
      { $match: { rol: 'USUARIO' } },
      {
        $lookup: {
          from: 'pedidos',
          localField: '_id',
          foreignField: 'vendedor',
          as: 'userOrders',
        },
      },
      { $unwind: '$userOrders' },
      {
        $match: {
          'userOrders.estado': 'PAGADO',
          'userOrders.createdAt': { $gte: new Date('2021-05-01') },
        },
      },
      {
        $group: {
          _id: '$_id',
          root: { $mergeObjects: '$$ROOT' },
          orders: { $push: '$userOrders' },
        },
      },
    ]);

    const dateToQuery = getDateToQuery(date);

    return res.map((response) => {
      const { orders } = getTotalAndCountOrders({
        orders: response.orders,
        ...dateToQuery,
      });

      return { usuario: response.root.nombre, pedidos: orders };
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getUserProductivity({ id, current }) {
  const { year, month, day } = getFullDateInNumber();

  const orders = await Pedido.find(
    {
      estado: 'PAGADO',
      vendedor: id ? id : current.id,
      createdAt: { $gte: new Date('2021-05-01') },
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

async function getCurrentProductivity({ date }) {
  const dateToQuery = getDateToQuery(date);

  const orders = await Pedido.find(
    {
      estado: 'PAGADO',
      createdAt: { $gte: new Date('2021-06-01') },
    },
    'createdAt total',
    { sort: { _id: -1 } }
  );

  const { total, count } = getTotalAndCountOrders({ orders, ...dateToQuery });

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
  getUserOrders,
};
