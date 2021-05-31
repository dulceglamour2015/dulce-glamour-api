const { Cliente } = require('../database/Cliente');
const { Usuario } = require('../database/Usuario');
const { Pedido } = require('../database/Pedido');
const { loaderFactory } = require('../utils/loaderFactory');
const {
  findAllOrderPaginate,
  findAllOrders,
  order,
  discountProductsStock,
  restoreProductsStock,
  saveOrder,
  updateOrder,
  removeOrder,
} = require('../lib/order-lib');

const select = {
  cliente: 1,
  vendedor: 1,
  total: 1,
  estado: 1,
  direccion: 1,
  createdAt: 1,
};

async function getOrders(current, page) {
  const opts = {
    page,
    limit: 400,
    sort: { _id: -1 },
    prejection: select,
  };
  const optsAdmin = {
    ...opts,
    limit: 100,
  };

  if (current.rol === 'ADMINISTRADOR') {
    return await findAllOrderPaginate({}, optsAdmin);
  }

  return await findAllOrderPaginate({ vendedor: current.id }, opts);
}

async function getPaidOrders(current, fields) {
  if (current.rol === 'ADMINISTRADOR') {
    return await findAllOrders({ estado: 'PAGADO' }, { fields });
  }

  return await findAllOrders(
    { estado: 'PAGADO', vendedor: current.id },
    { fields }
  );
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
      const usuario = await Usuario.findOne({ nombre: seller });
      return await findAllOrders({ vendedor: usuario._id }, { fields: select });
    } catch (error) {
      console.error(error.message);
      throw new Error('No hay pedidos para este usuario');
    }
  }
}

async function addOrder(input, current) {
  const { cliente: clientId } = input;
  const client = await Cliente.findById(clientId);
  if (!client) throw new Error('Cliente no existe');

  await discountProductsStock(input.pedido);
  await saveOrder(input, current);
}

async function setOrder(input, prev, id) {
  if (prev) await restoreProductsStock(prev.pedido);
  if (input.pedido) await discountProductsStock(input.pedido);

  return await updateOrder(id, input);
}

async function setPaidOrder(input, id) {
  return await updateOrder(id, input);
}

async function deleteOrder(id) {
  const beforeDelete = await order({ _id: id });
  await restoreProductsStock(beforeDelete.pedido);
  await removeOrder(id);
}

async function getOrderClient(parent, loader) {
  try {
    return await loaderFactory(loader, Cliente, parent);
  } catch (error) {
    throw new Error('Error al cargar clientes');
  }
}

async function getOrderSeller(parent, loader) {
  try {
    return await loaderFactory(loader, Usuario, parent);
  } catch (error) {
    throw new Error('Error al cargar usuarios');
  }
}

async function totalOrdersCount() {
  try {
    return await Pedido.countDocuments();
  } catch (error) {
    throw new Error('❌Error! ❌');
  }
}
async function setStatusOrder(status, id) {
  const existePedido = await Pedido.findById(id);
  if (!existePedido) {
    throw new Error('❌Error! ❌');
  }
  if (status === 'PAGADO') {
    existePedido.createdAt = new Date();
  }
  try {
    return await Pedido.findOneAndUpdate(
      { _id: id },
      { estado: status },
      {
        new: true,
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getOrders,
  getOrder,
  getOrderSeller,
  getOrderClient,
  getPaidOrders,
  getDispatchOrders,
  addOrder,
  setOrder,
  setStatusOrder,
  setPaidOrder,
  deleteOrder,
  searchOrders,
  totalOrdersCount,
};
