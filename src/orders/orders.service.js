const { Cliente } = require('../clients/client.model');
const { Pedido } = require('./orders.model');
const { loaderFactory } = require('../utils/loaderFactory');
const { findUserByFilter } = require('../users/users.lib');
const { getMongooseSelectionFromReq } = require('../utils/selectFields');
const { getCurrentDateISO } = require('../utils/formatDate');
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
} = require('./orders.lib');
const { getDateToQuery } = require('../stadistics/stadistics.lib');
const { DateTime } = require('luxon');

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
  getOrders: async function ({ current, page, type }) {
    const opts = {
      page,
      limit: 100,
      sort: { _id: -1 },
      prejection: select,
    };
    const optsAdmin = {
      ...opts,
    };

    try {
      if (current.rol === 'USUARIO') {
        return await findAllOrderPaginate(
          {
            vendedor: current.id,
            estado: 'PENDIENTE',
            createdAt: { $gte: new Date('2021-09-01') },
            tipoVenta: type ? type : undefined,
          },
          optsAdmin
        );
      }
      return await findAllOrderPaginate(
        {
          tipoVenta: type ? type : undefined,
          estado: 'PENDIENTE',
          createdAt: { $gte: new Date('2021-09-01') },
        },
        optsAdmin
      );
    } catch (error) {
      throw new Error('Error al cargar pedidos');
    }
  },
  getPaidOrders: async function ({ current, page, type }) {
    const opts = {
      page,
      limit: 300,
      sort: { _id: -1 },
      prejection: select,
    };
    const optsAdmin = {
      ...opts,
    };

    try {
      if (current.rol === 'USUARIO') {
        return await findAllOrderPaginate(
          {
            vendedor: current.id,
            estado: 'PAGADO',
            tipoVenta: type ? type : undefined,
          },
          optsAdmin
        );
      }
      return await findAllOrderPaginate(
        { estado: 'PAGADO', tipoVenta: type ? type : undefined },
        optsAdmin
      );
    } catch (error) {
      throw new Error('Error al cargar pedidos');
    }
  },

  getOrdersToAttend: async function (page) {
    const opts = {
      page,
      limit: 25,
      sort: { _id: -1 },
      prejection: select,
    };
    const { year, day, month } = getDateToQuery();
    const currentDate = DateTime.fromObject({
      year,
      month,
      day,
      hour: 0,
      minute: 0,
      millisecond: 0,
    })
      .setZone('America/Lima')
      .toJSDate();

    return await findAllOrderPaginate(
      {
        estado: 'PAGADO',
        atendido: false,
        tipoVenta: 'ENLINEA',
        createdAt: { $gte: new Date('2021-06-01') },
        fechaPago: { $gte: new Date(currentDate) },
      },
      opts
    );
  },

  getOrdersToPackIn: async function (page) {
    const opts = {
      page,
      limit: 25,
      sort: { _id: -1 },
      prejection: select,
    };

    return await findAllOrderPaginate(
      {
        estado: 'PAGADO',
        atendido: true,
        embalado: false,
        tipoVenta: 'ENLINEA',
        createdAt: { $gte: new Date('2021-06-01') },
      },
      opts
    );
  },
  getOrdersToSend: async function (page) {
    const opts = {
      page,
      limit: 25,
      sort: { _id: -1 },
      prejection: select,
    };

    return await findAllOrderPaginate(
      {
        estado: 'PAGADO',
        atendido: true,
        embalado: true,
        enviado: false,
        tipoVenta: 'ENLINEA',
        createdAt: { $gte: new Date('2021-06-01') },
      },
      opts
    );
  },

  getOrdersDispatched: async function (page) {
    const opts = {
      page,
      limit: 25,
      sort: { _id: -1 },
      prejection: { ...select, enviado: 1, embalado: 1 },
    };
    const { year, day, month } = getDateToQuery();
    const currentDate = DateTime.fromObject({
      year,
      month,
      day,
      hour: 0,
      minute: 0,
      millisecond: 0,
    })
      .setZone('America/Lima')
      .toJSDate();

    return await findAllOrderPaginate(
      {
        estado: 'PAGADO',
        atendido: true,
        embalado: true,
        enviado: true,
        tipoVenta: 'ENLINEA',
        createdAt: { $gte: new Date('2021-06-01') },
        fechaPago: { $gte: new Date(currentDate) },
      },
      opts
    );
  },

  getCanceledOrders: async function (info) {
    const fields = getMongooseSelectionFromReq(info);
    return await findAllOrders({ estado: 'ANULADO' }, { fields });
  },

  getDispatchOrders: async function (current, fields) {
    if (current.rol === 'ADMINISTRADOR') {
      return await findAllOrders({ estado: 'DESPACHADO' }, { fields });
    }

    return await findAllOrders(
      { estado: 'DESPACHADO', vendedor: current.id },
      { fields }
    );
  },

  getOrder: async function (id) {
    return await order({ _id: id });
  },

  searchOrdersService: async function ({ seller, client }) {
    if (!!client) {
      try {
        const existClient = await Cliente.findOne({ nombre: client });

        return await findAllOrders(
          {
            estado: { $not: { $regex: /^ANULADO$/ } },
            cliente: existClient._id,
            createdAt: { $gte: new Date('2021-01-01') },
          },
          { fields: select, limit: 400 }
        );
      } catch (error) {
        throw new Error('No hay pedidos para este cliente');
      }
    } else if (!!seller) {
      try {
        const usuario = await findUserByFilter({
          rol: 'USUARIO',
          $or: [{ nombre: seller }, { username: seller }],
        });
        return await findAllOrders(
          {
            estado: { $not: { $regex: /^ANULADO$/ } },
            vendedor: usuario._id,
            createdAt: { $gte: new Date('2021-01-01') },
          },
          { fields: select, limit: 400 }
        );
      } catch (error) {
        throw new Error('No hay pedidos para este usuario');
      }
    }
  },

  addOrder: async function (input, current) {
    const { cliente: clientId } = input;
    const client = await Cliente.findById(clientId);
    if (!client) throw new Error('Cliente no existe');

    if (input.tipoVenta === 'DIRECTA') {
      if (input.pedido) {
        await checkProductStockFromOrder(input.pedido);
        await discountProductsStockFromOrder(input.pedido);
        return await saveOrder(input, current);
      }
    }

    if (input.tipoVenta === 'ENLINEA') {
      await checkProductStockFromOrder(input.pedido);
      return await saveOrder(input, current);
    }
  },

  setOrderWithStock: async function ({ input, prev, id }) {
    const dbOrder = await Pedido.findById(id);

    if (!!dbOrder) {
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

  getOrderClient: async function (parent, loader) {
    try {
      return await loaderFactory(loader, Cliente, parent);
    } catch (error) {
      throw new Error('Error al cargar clientes');
    }
  },
  totalOrdersCount: async function () {
    try {
      return await Pedido.countDocuments();
    } catch (error) {
      throw new Error('❌Error! ❌');
    }
  },
  setStatusOrder: async function ({ input, id }) {
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
