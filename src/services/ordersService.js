const { Cliente } = require('../database/Cliente');
const { Usuario } = require('../database/Usuario');
const { Pedido } = require('../database/Pedido');
const { Products: Producto } = require('../database/Products');
const { File } = require('../database/Fiel');
const { loaderFactory } = require('../utils/loaderFactory');

const select = {
  cliente: 1,
  vendedor: 1,
  total: 1,
  estado: 1,
  direccion: 1,
  createdAt: 1
};

async function getOrders(current, page) {
  const opts = {
    page,
    limit: 200,
    sort: { _id: -1 },
    prejection: select
  };
  const optsAdmin = {
    page,
    limit: 100,
    sort: { _id: -1 },
    prejection: select
  };
  const query = {};
  const queryUser = { vendedor: current.id };

  if (current.rol === 'ADMINISTRADOR') {
    try {
      const { docs, totalDocs, totalPages, nextPage } = await Pedido.paginate(
        query,
        optsAdmin
      );
      return {
        pedidos: docs,
        pageInfo: {
          totalDocs,
          totalPages,
          nextPage
        }
      };
    } catch (error) {
      throw new Error('Error!');
    }
  }

  try {
    const { docs, totalDocs, totalPages, nextPage } = await Pedido.paginate(
      queryUser,
      opts
    );
    return {
      pedidos: docs,
      pageInfo: {
        totalDocs,
        totalPages,
        nextPage
      }
    };
  } catch (error) {
    throw new Error('Error!');
  }
}

async function getPaidOrders(current, fields) {
  if (current.rol === 'ADMINISTRADOR') {
    try {
      return await Pedido.find({ estado: 'PAGADO' })
        .select(fields)
        .sort({ _id: -1 });
    } catch (error) {
      throw new Error('❌Error! ❌');
    }
  }

  try {
    return await Pedido.find({ estado: 'PAGADO', vendedor: current.id })
      .select(fields)
      .sort({ _id: -1 });
  } catch (error) {
    throw new Error('❌Error! ❌');
  }
}

async function getDispatchOrders(current, fields) {
  if (current.rol === 'ADMINISTRADOR') {
    try {
      return await Pedido.find({ estado: 'DESPACHADO' })
        .select(fields)
        .sort({ _id: -1 });
    } catch (error) {
      throw new Error('❌Error! ❌');
    }
  }
  try {
    return await Pedido.find({ estado: 'DESPACHADO', vendedor: current.id })
      .select(fields)
      .sort({ _id: -1 });
  } catch (error) {
    throw new Error('❌Error! ❌');
  }
}

async function getOrder(id) {
  try {
    return await Pedido.findById(id);
  } catch (error) {
    throw new Error('❌Error! ❌');
  }
}

async function addOrder(input, current, image) {
  const { cliente: clientId } = input;
  const client = await Cliente.findById(clientId);
  if (!client) throw new Error('Cliente no existe');

  for await (const articulo of input.pedido) {
    const { id } = articulo;
    const producto = await Producto.findById(id);
    if (articulo.cantidad > producto.existencia) {
      throw new Error(
        `El articulo: ${producto.nombre} excede la cantidad disponible`
      );
    }
    producto.existencia = producto.existencia - articulo.cantidad;
    await producto.save();
  }
  const nuevoPedido = new Pedido(input);
  nuevoPedido.id = nuevoPedido._id;
  nuevoPedido.vendedor = current.id;
  try {
    await nuevoPedido.save();
    return nuevoPedido;
  } catch (error) {
    throw new Error('No se guardo el pedido');
  }
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

async function getOrderImage(parent, loader) {
  try {
    return await loaderFactory(loader, File, parent);
  } catch (error) {
    throw new Error('Error al cargar imagenes');
  }
}

async function totalOrdersCount() {
  try {
    return await Pedido.countDocuments();
  } catch (error) {
    throw new Error('❌Error! ❌');
  }
}

async function searchOrders(filter) {
  let query = {};
  const startOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(
    new Date().setUTCHours(23, 59, 59, 999)
  ).toISOString();
  let createdAt = {
    $gte: startOfDay,
    $lte: endOfDay
  };

  if (filter) {
    const { seller, client } = filter;

    if (client !== undefined) {
      try {
        const existClient = await Cliente.findOne({ nombre: client });
        return await Pedido.find({ cliente: existClient._id })
          .sort({ _id: -1 })
          .select(select);
      } catch (error) {
        throw new Error('No hay pedidos para este cliente');
      }
    }

    if (seller !== undefined) {
      try {
        const usuario = await Usuario.findOne({ nombre: seller });
        return await Pedido.find({
          vendedor: usuario._id
        })
          .sort({ _id: -1 })
          .select(select);
      } catch (error) {
        console.error(error.message);
        throw new Error('No hay pedidos para este usuario');
      }
    }
  }
}

async function setOrder(input, prev, id) {
  const existePedido = await Pedido.findById(id);
  if (!existePedido) {
    throw new Error('❌Error! ❌');
  }

  if (prev) {
    for await (const articulo of prev.pedido) {
      const { id } = articulo;
      const prevProduct = await Producto.findById(id);

      prevProduct.existencia = prevProduct.existencia + articulo.cantidad;

      await prevProduct.save();
    }
  }

  if (existePedido.estado === 'PENDIENTE') {
    for await (const articulo of input.pedido) {
      const { id } = articulo;
      const product = await Producto.findById(id);
      if (articulo.cantidad > product.existencia) {
        throw new Error(
          `El articulo: ${product.nombre} excede la cantidad disponible`
        );
      }

      product.existencia = product.existencia - articulo.cantidad;

      await product.save();
    }
  }

  try {
    return await Pedido.findOneAndUpdate({ _id: id }, input, {
      new: true
    });
  } catch (error) {
    throw new Error(error.message);
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
        new: true
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

async function setPaidOrder(input, id, file) {
  const exist = await Pedido.findById(id);
  // const dbFile = await uploadFile(file);
  if (!exist) throw new Error('El pedido no existe!');

  try {
    return await Pedido.findByIdAndUpdate(id, input, { new: true });
  } catch (error) {
    console.error(error);
    throw new Error('Error editando pedido');
  }
}

async function deleteOrder(id) {
  let order;
  try {
    order = await Pedido.findById(id);
  } catch (error) {
    throw new Error('❌Error! ❌');
  }

  for await (const articulo of order.pedido) {
    const { id } = articulo;
    const producto = await Producto.findById(id);

    producto.existencia = producto.existencia + articulo.cantidad;

    await producto.save();
  }

  try {
    await Pedido.findOneAndDelete({ _id: id });
    return 'Pedido Eliminado';
  } catch (error) {
    throw new Error('❌Error! ❌');
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
  getOrderImage
};
