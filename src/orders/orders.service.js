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

async function getOrders(current, page) {
  const opts = {
    page,
    limit: 100,
    sort: { _id: -1 },
    prejection: select,
  };
  const optsAdmin = {
    ...opts,
  };

  if (current.rol === 'ADMINISTRADOR') {
    return await findAllOrderPaginate({ estado: 'PENDIENTE' }, optsAdmin);
  }

  return await findAllOrderPaginate(
    {
      estado: 'PENDIENTE',
      vendedor: current.id,
      createdAt: { $gte: new Date('2021-06-01') },
    },
    opts
  );
}
async function getPaidOrders(current, page) {
  const opts = {
    page,
    limit: 100,
    sort: { _id: -1 },
    prejection: select,
  };
  const optsAdmin = {
    ...opts,
  };

  if (current.rol === 'ADMINISTRADOR') {
    return await findAllOrderPaginate({ estado: 'PAGADO' }, optsAdmin);
  }

  return await findAllOrderPaginate(
    {
      estado: 'PAGADO',
      vendedor: current.id,
      createdAt: { $gte: new Date('2021-06-01') },
    },
    opts
  );
}
async function getOrdersToAttend(page) {
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
      createdAt: { $gte: new Date('2021-06-01') },
    },
    opts
  );
}

async function getCanceledOrders(info) {
  const fields = getMongooseSelectionFromReq(info);
  return await findAllOrders({ estado: 'ANULADO' }, { fields });
}

async function getDispatchOrders(current, fields) {
  if (current.rol === 'ADMINISTRADOR') {
    return await findAllOrders({ estado: 'DESPACHADO' }, { fields });
  }

  return await findAllOrders(
    { estado: 'DESPACHADO', vendedor: current.id },
    { fields }
  );
}

async function getOrder(id) {
  return await order({ _id: id });
}

async function searchOrders({ seller, client }) {
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
      return await findAllOrders({ vendedor: usuario._id }, { fields: select });
    } catch (error) {
      throw new Error('No hay pedidos para este usuario');
    }
  }
}

async function addOrder(input, current) {
  const { cliente: clientId } = input;
  const client = await Cliente.findById(clientId);
  if (!client) throw new Error('Cliente no existe');

  if (input.tipoVenta === 'DIRECTA') {
    if (input.pedido) await discountProductsStock(input.pedido);
  }

  return await saveOrder(input, current);
}

async function setOrderWithStock(input, prev, id) {
  if (prev) await restoreProductsStock(prev.pedido);
  if (input.pedido) await discountProductsStock(input.pedido);

  return await updateOrder(id, input);
}

async function setOrderWithoutStock(input, id) {
  return await updateOrder(id, input);
}

async function setPaidOrder(input, id) {
  const dbOrder = await order({ _id: id });
  dbOrder.fechaPago = getCurrentDateISO();
  await dbOrder.save();
  await discountProductsStock(dbOrder.pedido);
  return await updateOrder(id, input);
}

async function setAttendOrder(id) {
  const dbOrder = await order({ _id: id });

  if (dbOrder.estado === 'PAGADO') {
    dbOrder.atendido = true;
    dbOrder.fechaAtentido = getCurrentDateISO();
  }

  try {
    await dbOrder.save();
    return dbOrder;
  } catch (error) {
    throw new Error('No se pudo editar el pedido');
  }
}

async function deleteOrder(id) {
  return await removeOrder(id);
}

async function getOrderClient(parent, loader) {
  try {
    return await loaderFactory(loader, Cliente, parent);
  } catch (error) {
    throw new Error('Error al cargar clientes');
  }
}

async function totalOrdersCount() {
  try {
    return await Pedido.countDocuments();
  } catch (error) {
    throw new Error('❌Error! ❌');
  }
}
async function setStatusOrder({ input, id }) {
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
}

module.exports = {
  getOrders,
  getOrder,
  getOrderClient,
  getPaidOrders,
  getDispatchOrders,
  addOrder,
  setOrderWithoutStock,
  setStatusOrder,
  setPaidOrder,
  deleteOrder,
  searchOrders,
  totalOrdersCount,
  setOrderWithStock,
  getCanceledOrders,
  getOrdersToAttend,
  setAttendOrder,
};
