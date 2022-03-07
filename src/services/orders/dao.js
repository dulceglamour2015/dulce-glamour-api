const { Cliente } = require('../clients/collection');
const { Pedido } = require('./collection');
const { Usuario } = require('../users/collection');
const { isAdmin } = require('../users/lib');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');
const { getCurrentDateISO } = require('../../utils/formatDate');
const {
  findAllOrderPaginate,
  findAllOrders,
  order,
  saveOrder,
  updateOrder,
  removeOrder,
  restoreProductsStock,
  checkProductStockFromOrder,
  discountProductsStockFromOrder,
  getFilterDate,
} = require('./lib');

const select = {
  cliente: 1,
  vendedor: 1,
  total: 1,
  estado: 1,
  atendido: 1,
  direccion: 1,
  createdAt: 1,
};

module.exports = {
  getOrders: async function ({ current, page, type, status }) {
    const opts = {
      page,
      limit: 100,
      sort: { _id: -1 },
    };

    const query = {
      tipoVenta: type ?? undefined,
      estado: status ?? undefined,
      createdAt: { $gte: new Date('2021-09-01') },
    };

    if (isAdmin(current)) return await findAllOrderPaginate(query, opts);
    return await findAllOrderPaginate({ ...query, vendedor: current.id }, opts);
  },
  getOrdersToAttend: async function (page) {
    const dateToQuery = getFilterDate(0, 0, 0, 0);
    const opts = {
      page,
      limit: 25,
      sort: { _id: -1 },
      prejection: select,
    };
    const query = {
      estado: 'PAGADO',
      atendido: false,
      tipoVenta: 'ENLINEA',
      fechaPago: { $gte: new Date(dateToQuery) },
    };

    return await findAllOrderPaginate(query, opts);
  },
  getOrdersToPackIn: async function (page) {
    const opts = {
      page,
      limit: 25,
      sort: { _id: -1 },
      prejection: select,
    };
    const query = {
      estado: 'PAGADO',
      atendido: true,
      embalado: false,
      tipoVenta: 'ENLINEA',
      createdAt: { $gte: new Date('2021-06-01') },
    };

    return await findAllOrderPaginate(query, opts);
  },
  getOrdersToSend: async function (page) {
    const opts = {
      page,
      limit: 25,
      sort: { _id: -1 },
      prejection: select,
    };
    const query = {
      estado: 'PAGADO',
      atendido: true,
      embalado: true,
      enviado: false,
      tipoVenta: 'ENLINEA',
      createdAt: { $gte: new Date('2021-06-01') },
    };

    return await findAllOrderPaginate(query, opts);
  },
  getOrdersDispatched: async function (page) {
    const dateToQuery = getFilterDate(0, 0, 0, 0);
    const opts = {
      page,
      limit: 25,
      sort: { _id: -1 },
      prejection: { ...select, enviado: 1, embalado: 1 },
    };
    const query = {
      estado: 'PAGADO',
      atendido: true,
      embalado: true,
      enviado: true,
      tipoVenta: 'ENLINEA',
      fechaPago: { $gte: new Date(dateToQuery) },
    };

    return await findAllOrderPaginate(query, opts);
  },
  getCanceledOrders: async function (info) {
    const fields = getMongooseSelectionFromReq(info);
    return await findAllOrders({ estado: 'ANULADO' }, { fields });
  },
  getDispatchOrders: async function (current, fields) {
    if (isAdmin(current))
      return await findAllOrders({ estado: 'DESPACHADO' }, { fields });

    return await findAllOrders(
      { estado: 'DESPACHADO', vendedor: current.id },
      { fields }
    );
  },
  getOrder: async function (id) {
    return await order({ _id: id });
  },
  searchOrders: async function ({ seller, client }) {
    const query = {
      estado: 'PAGADO',
      createdAt: { $gte: new Date('2021-01-01') },
    };

    if (client) {
      const dbClient = await Cliente.findOne({ nombre: client });

      if (!dbClient) {
        throw new Error('Lo sentimos el cliente que buscas no existe.');
      }

      return new Promise((resolve, reject) =>
        Pedido.find({ ...query, cliente: dbClient._id })
          .select(select)
          .limit(200)
          .sort({ _id: -1 })
          .lean()
          .exec((error, results) => {
            if (error) {
              return reject(
                new Error('Lo sentimos no encontramos los recursos.')
              );
            }
            return resolve(
              results.map((order) => ({ ...order, id: order._id }))
            );
          })
      );
    }
    if (seller) {
      const dbUser = await Usuario.findOne({
        rol: 'USUARIO',
        $or: [{ nombre: seller }, { username: seller }],
      });
      if (!dbUser) {
        throw new Error('Lo sentimos el usuario que buscas no existe.');
      }

      return new Promise((resolve, reject) =>
        Pedido.find({ ...query, vendedor: dbUser._id })
          .select(select)
          .limit(200)
          .sort({ _id: -1 })
          .lean()
          .exec((error, results) => {
            if (error) {
              return reject(
                new Error('Lo sentimos no encontramos los recursos.')
              );
            }
            return resolve(
              results.map((order) => ({ ...order, id: order._id }))
            );
          })
      );
    }
  },
  addOrder: async function (input, current) {
    const { cliente, tipoVenta, pedido } = input;
    const client = await Cliente.findById(cliente);
    if (!client) throw new Error('Cliente no existe');

    if (tipoVenta === 'DIRECTA') {
      if (pedido) {
        await checkProductStockFromOrder(pedido);
        await discountProductsStockFromOrder(pedido);
      }
      return await saveOrder(input, current);
    }

    if (tipoVenta === 'ENLINEA') {
      if (pedido) await checkProductStockFromOrder(pedido);

      return await saveOrder(input, current);
    }
  },
  setOrderWithStock: async function ({ input, prev, id }) {
    const dbOrder = await Pedido.findById(id);

    if (dbOrder) {
      if (input.pedido && prev) {
        await checkProductStockFromOrder(input.pedido);
        await restoreProductsStock(prev);
        await discountProductsStockFromOrder(input.pedido);
        return await updateOrder(id, input);
      }
    } else {
      throw new Error('Order not exist');
    }
  },
  setOrderWithoutStock: async function (input, id) {
    if (input.pedido) {
      await checkProductStockFromOrder(input.pedido);
    }
    return await updateOrder(id, input);
  },
  setPaidOrder: async function (input, id) {
    const dbOrder = await order({ _id: id });
    dbOrder.fechaPago = getCurrentDateISO();
    await dbOrder.save();
    if (dbOrder.pedido) {
      await checkProductStockFromOrder(dbOrder.pedido);
      await discountProductsStockFromOrder(dbOrder.pedido);
    }
    return await updateOrder(id, input);
  },
  setAttendOrder: async function (id, current) {
    const dbOrder = await order({ _id: id });

    if (dbOrder.estado === 'PAGADO') {
      dbOrder.atendido = true;
      dbOrder.fechaAtentido = getCurrentDateISO();
      dbOrder.despachador = current.id;
    }

    try {
      await dbOrder.save();
      return dbOrder;
    } catch (error) {
      throw new Error('No se pudo editar el pedido');
    }
  },
  setPackinOrder: async function (id, current) {
    const dbOrder = await order({ _id: id });

    if (dbOrder.estado === 'PAGADO') {
      dbOrder.embalado = true;
      dbOrder.fechaEmbalado = getCurrentDateISO();
      dbOrder.embalador = current.id;
    }

    try {
      await dbOrder.save();
      return dbOrder;
    } catch (error) {
      console.log(error);
      throw new Error('No se pudo editar el pedido');
    }
  },
  setToSendOrder: async function (ids) {
    try {
      await Pedido.updateMany(
        { _id: { $in: ids } },
        { enviado: true, fechaEnvio: getCurrentDateISO() },
        { multi: true, new: true, upsert: false }
      ).exec();
      return 'Pedido editados';
    } catch (error) {
      console.log(error);
      throw new Error('No se pudo editar el pedido');
    }
  },
  deleteOrder: async function (id) {
    return await removeOrder(id);
  },
  totalOrdersCount: async function () {
    try {
      return await Pedido.countDocuments();
    } catch (error) {
      throw new Error('❌Error! ❌');
    }
  },
  setStatusOrder: async function (input, id) {
    const dbOrder = await order({ _id: id });

    if (input.estado === 'ANULADO') {
      dbOrder.fechaAnulado = getCurrentDateISO();
      await dbOrder.save();
      await restoreProductsStock(dbOrder.pedido);
    }

    try {
      return await Pedido.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
