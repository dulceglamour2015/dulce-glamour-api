const { Pedido } = require('../orders/collection');
const {
  getAggregateSellerOrderOpts,
  getDateToQuery,
  getAggregateClientsOrderOpts,
} = require('./lib');
const { DateTime } = require('luxon');
const { getISOStringDate } = require('../../utils/formatDate');

async function getAggregateClientFilter(filter) {
  const match = {
    estado: 'PAGADO',
  };
  let from;
  let to;
  if (filter) {
    from = getISOStringDate({
      date: filter.from,
      hours: 0,
      min: 0,
      sec: 0,
      ms: 0,
    });
    to = getISOStringDate({
      date: filter.to,
      hours: 23,
      min: 59,
      sec: 59,
      ms: 999,
    });
    match.fechaPago = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

  const aggregate = getAggregateClientsOrderOpts({ match });
  try {
    return await Pedido.aggregate(aggregate);
  } catch (error) {
    console.error(error.message);
    throw new Error('No se pudo obtener a los mejores clientes!');
  }
}

async function getAggregateSellerFilter(filter) {
  const match = {
    estado: 'PAGADO',
  };
  let from;
  let to;
  if (filter) {
    console.log('passfilter', filter);
    from = getISOStringDate({
      date: filter.from,
      hours: 0,
      min: 0,
      sec: 0,
      ms: 0,
    });
    to = getISOStringDate({
      date: filter.to,
      hours: 23,
      min: 59,
      sec: 59,
      ms: 999,
    });
    match.fechaPago = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

  try {
    const [ordersSellers, online, direct, withoutTypePay] = await Promise.all([
      Pedido.aggregate(
        getAggregateSellerOrderOpts({
          match: {
            $match: { ...match },
          },
        })
      ),
      Pedido.aggregate(
        getAggregateSellerOrderOpts({
          match: {
            $match: {
              ...match,
              tipoVenta: 'ENLINEA',
            },
          },
        })
      ),
      Pedido.aggregate(
        getAggregateSellerOrderOpts({
          match: {
            $match: {
              ...match,
              tipoVenta: 'DIRECTA',
            },
          },
        })
      ),
      Pedido.aggregate(
        getAggregateSellerOrderOpts({
          match: {
            $match: {
              ...match,
              tipoVenta: { $exists: false },
            },
          },
        })
      ),
    ]);
    const onlineResponse = {
      total: online.reduce((acc, item) => (acc += item.total), 0),
      qtityOrders: online.reduce((acc, item) => (acc += item.cantPedido), 0),
    };

    const directResponse = {
      total: direct.reduce((acc, item) => (acc += item.total), 0),
      qtityOrders: direct.reduce((acc, item) => (acc += item.cantPedido), 0),
    };

    const withoutMethodResponse = {
      total: withoutTypePay.reduce((acc, item) => (acc += item.total), 0),
      qtityOrders: withoutTypePay.reduce(
        (acc, item) => (acc += item.cantPedido),
        0
      ),
    };

    return {
      ordersSellers,
      onlineResponse,
      directResponse,
      withoutMethodResponse,
    };
  } catch (error) {
    console.error(error);
    throw new Error('No se pudo obtener a los mejores vendedores!');
  }
}

// Helper para obtener la productitivdad de todos los usuarios
// primer query trae la fecha actual, despues puede pasarsele el parametro "date"
async function getCurrentProductivity({ date }) {
  const { year, month, day } = getDateToQuery(date);
  let currentDate = DateTime.fromObject({
    year,
    month,
    day,
    hour: 0,
    minute: 0,
    millisecond: 0,
  })
    .setZone('America/Lima')
    .toJSDate();
  let dateFilterStart;
  let dateFilterFinal;
  const match = {
    estado: 'PAGADO',
    fechaPago: { $gte: new Date(currentDate) },
  };

  if (date) {
    dateFilterStart = DateTime.fromObject({
      year,
      month,
      day,
      hour: 0,
      minute: 0,
      millisecond: 0,
    })
      .setZone('America/Lima')
      .toJSDate();
    dateFilterFinal = DateTime.fromObject({
      year,
      month,
      day,
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
    })
      .setZone('America/Lima')
      .toJSDate();

    match.fechaPago = {
      $gte: new Date(dateFilterStart),
      $lte: new Date(dateFilterFinal),
    };
  }

  const orders = await Pedido.find(match, 'createdAt fechaPago total', {
    sort: { _id: -1 },
  });

  return {
    total: orders.reduce((acc, item) => (acc += item.total), 0),
    count: orders.length,
  };
}

module.exports = {
  getAggregateClientFilter,
  getAggregateSellerFilter,
  getCurrentProductivity,
};
