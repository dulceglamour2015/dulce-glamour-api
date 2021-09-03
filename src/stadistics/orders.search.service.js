const { Usuario } = require('../users/users.model');

const { Pedido } = require('../orders/orders.model');
const {
  getAggregateSellerOrderOpts,
  getDateToQuery,
  getAggregateClientsOrderOpts,
} = require('./stadistics.lib');
const { DateTime } = require('luxon');

async function getAggregateClient() {
  const aggregate = getAggregateClientsOrderOpts({
    match: {
      $match: { estado: 'PAGADO' },
    },
  });
  try {
    return await Pedido.aggregate(aggregate);
  } catch (error) {
    throw new Error('No se pudo obtener a los mejores clientes!');
  }
}

// Mejore el rango de fechas haciendolo el from desde las 0 0 0 0 horas
// y el to hast las 23 59 59 999 horas

async function getAggregateClientFilter(filter) {
  const from = getISOStringDate({
    date: filter.from,
    hours: 0,
    min: 0,
    sec: 0,
    ms: 0,
  });
  const to = getISOStringDate({
    date: filter.to,
    hours: 23,
    min: 59,
    sec: 59,
    ms: 999,
  });
  const match = {
    estado: 'PAGADO',
    fechaPago: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
  };
  const aggregate = getAggregateClientsOrderOpts({ match });
  try {
    return await Pedido.aggregate(aggregate);
  } catch (error) {
    console.error(error.message);
    throw new Error('No se pudo obtener a los mejores clientes!');
  }
}

async function getAggregateSeller() {
  const aggregateAllPaidOpts = getAggregateSellerOrderOpts({
    match: {
      $match: {
        estado: 'PAGADO',
      },
    },
  });
  const aggregatePaidOnlineOpts = getAggregateSellerOrderOpts({
    match: {
      $match: {
        estado: 'PAGADO',
        tipoVenta: 'ENLINEA',
      },
    },
  });
  const aggregatePaidDirectOpts = getAggregateSellerOrderOpts({
    match: {
      $match: {
        estado: 'PAGADO',
        tipoVenta: 'DIRECTA',
      },
    },
  });
  const aggregateWithouPaidMethodOpts = getAggregateSellerOrderOpts({
    match: {
      $match: {
        estado: 'PAGADO',
        tipoVenta: { $exists: false },
      },
    },
  });
  try {
    const res = await Pedido.aggregate(aggregateAllPaidOpts);
    const online = await Pedido.aggregate(aggregatePaidOnlineOpts);
    const direct = await Pedido.aggregate(aggregatePaidDirectOpts);
    const withoutTypePay = await Pedido.aggregate(
      aggregateWithouPaidMethodOpts
    );
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
      ordersSellers: res,
      onlineResponse,
      directResponse,
      withoutMethodResponse,
    };
  } catch (error) {
    throw new Error('No se pudo obtener a los mejores vendedores!');
  }
}

function getISOStringDate({ date, hours, min, sec, ms }) {
  return new Date(
    new Date(date).setUTCHours(hours, min, sec, ms)
  ).toISOString();
}

async function getAggregateSellerFilter(filter) {
  const from = getISOStringDate({
    date: filter.from,
    hours: 0,
    min: 0,
    sec: 0,
    ms: 0,
  });
  const to = getISOStringDate({
    date: filter.to,
    hours: 23,
    min: 59,
    sec: 59,
    ms: 999,
  });
  const match = {
    estado: 'PAGADO',
    fechaPago: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
  };

  const aggregateAllPaidOpts = getAggregateSellerOrderOpts({
    match: {
      $match: { ...match },
    },
  });

  const aggregatePaidOnlineOpts = getAggregateSellerOrderOpts({
    match: {
      $match: {
        ...match,
        tipoVenta: 'ENLINEA',
      },
    },
  });
  const aggregatePaidDirectOpts = getAggregateSellerOrderOpts({
    match: {
      $match: {
        ...match,
        tipoVenta: 'DIRECTA',
      },
    },
  });
  const aggregateWithouPaidMethodOpts = getAggregateSellerOrderOpts({
    match: {
      $match: {
        ...match,
        tipoVenta: { $exists: false },
      },
    },
  });

  try {
    const res = await Pedido.aggregate(aggregateAllPaidOpts);
    const online = await Pedido.aggregate(aggregatePaidOnlineOpts);
    const direct = await Pedido.aggregate(aggregatePaidDirectOpts);
    const withoutTypePay = await Pedido.aggregate(
      aggregateWithouPaidMethodOpts
    );
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
      ordersSellers: res,
      onlineResponse,
      directResponse,
      withoutMethodResponse,
    };
  } catch (error) {
    throw new Error('No se pudo obtener a los mejores vendedores!');
  }
}

// Obtener usuarios con sus pedidos, pagina: Productividad
async function getUserOrders({ date }) {
  let currentDate;
  let dateFilterStart;
  let dateFilterFinal;

  if (date) {
    const { year, month, day } = getDateToQuery(date);
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
  } else {
    currentDate = DateTime.fromObject({
      hour: 0,
      minute: 0,
      millisecond: 0,
    })
      .setZone('America/Lima')
      .toJSDate();
  }

  try {
    const res = await Usuario.aggregate([
      {
        $match: {
          $or: [{ rol: 'USUARIO' }, { rol: 'ADMINISTRADOR' }],
        },
      },
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
          'userOrders.fechaPago':
            !!date === false
              ? { $gte: new Date(currentDate) }
              : {
                  $gte: new Date(dateFilterStart),
                  $lte: new Date(dateFilterFinal),
                },
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

    return res.map((response) => {
      return { usuario: response.root.nombre, pedidos: response.orders };
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

// Obtener la productividad en la pagina de inicio
async function getUserProductivity({ id, current }) {
  const currentDate = DateTime.fromObject({
    hour: 0,
    minute: 0,
    millisecond: 0,
  })
    .setZone('America/Lima')
    .toJSDate();

  const orders = await Pedido.find(
    {
      estado: 'PAGADO',
      vendedor: id ? id : current.id,
      fechaPago: { $gte: new Date(currentDate) },
    },
    'createdAt fechaPago total',
    { sort: { _id: -1 } }
  );

  return {
    total: orders.reduce((acc, item) => (acc += item.total), 0),
    count: orders.length,
  };
}

// Helper para obtener la productitivdad de todos los usuarios
// primer query trae la fecha actual, despues puede pasarsele el parametro "date"
async function getCurrentProductivity({ date }) {
  let currentDate;
  let dateFilterStart;
  let dateFilterFinal;

  const { year, month, day } = getDateToQuery(date);
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
  } else {
    currentDate = DateTime.fromObject({
      year,
      month,
      day,
      hour: 0,
      minute: 0,
      millisecond: 0,
    })
      .setZone('America/Lima')
      .toJSDate();
  }

  const orders = await Pedido.find(
    {
      estado: 'PAGADO',
      fechaPago:
        !!date === false
          ? { $gte: new Date(currentDate) }
          : {
              $gte: new Date(dateFilterStart),
              $lte: new Date(dateFilterFinal),
            },
    },
    'createdAt fechaPago total',
    { sort: { _id: -1 } }
  );

  return {
    total: orders.reduce((acc, item) => (acc += item.total), 0),
    count: orders.length,
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
