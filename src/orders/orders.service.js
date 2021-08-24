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
  discountProductsStock,
} = require('./orders.lib');

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
  getOrders: async function (current, page) {
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
          { vendedor: current.id, estado: 'PENDIENTE' },
          optsAdmin
        );
      }
      return await findAllOrderPaginate({ estado: 'PENDIENTE' }, optsAdmin);
    } catch (error) {
      throw new Error('Error al cargar pedidos');
    }
  },
  getPaidOrders: async function (current, page) {
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
          { vendedor: current.id, estado: 'PAGADO' },
          optsAdmin
        );
      }
      return await findAllOrderPaginate({ estado: 'PAGADO' }, optsAdmin);
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

    return await findAllOrderPaginate(
      {
        estado: 'PAGADO',
        atendido: false,
        tipoVenta: 'ENLINEA',
        createdAt: { $gte: new Date('2021-06-01') },
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

    return await findAllOrderPaginate(
      {
        estado: 'PAGADO',
        atendido: true,
        embalado: true,
        enviado: true,
        tipoVenta: 'ENLINEA',
        createdAt: { $gte: new Date('2021-06-01') },
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

  searchOrders: async function ({ seller, client }) {
    if (client !== undefined) {
      try {
        const existClient = await Cliente.findOne({ nombre: client });
        return await findAllOrders(
          { cliente: existClient._id },
          { fields: select }
        );
      } catch (error) {
        throw new Error('No hay pedidos para este cliente');
      }
    }

    if (seller !== undefined) {
      try {
        const usuario = await findUserByFilter({ nombre: seller });
        return await findAllOrders(
          { vendedor: usuario._id },
          { fields: select }
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
      if (input.pedido) await discountProductsStock(input.pedido);
    }

    return await saveOrder(input, current);
  },

  setOrderWithStock: async function ({ input, prev, id }) {
    const dbOrder = await Pedido.findById(id);

    if (!!dbOrder) {
      if (prev) await restoreProductsStock(prev.pedido);
      if (input.pedido) await discountProductsStock(input.pedido);
      return await updateOrder(id, input);
    } else {
      throw new Error('Order not exist');
    }
  },

  setOrderWithoutStock: async function (input, id) {
    return await updateOrder(id, input);
  },

  setPaidOrder: async function (input, id) {
    const dbOrder = await order({ _id: id });
    dbOrder.fechaPago = getCurrentDateISO();
    await dbOrder.save();
    await discountProductsStock(dbOrder.pedido);
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
