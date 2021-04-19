const { Cliente } = require('../database/Cliente');
const { Pedido } = require('../database/Pedido');
const { Products: Producto } = require('../database/Products');

async function getOrders(current, fields, page) {
  const opts = {
    page,
    limit: 200,
    sort: { _id: -1 }
  };

  const query = { estado: 'PENDIENTE' };
  const queryUser = { estado: 'PENDIENTE', vendedor: current.id };

  if (current.rol === 'ADMINISTRADOR') {
    try {
      const { docs, totalDocs, totalPages, nextPage } = await Pedido.paginate(
        query,
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

async function addOrder(input, current) {
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

async function searchOrders(filter) {
  const { seller, client } = filter;
  const query = {
    ...(seller && { nombre: seller }),
    ...(client && { nombre: client })
  };

  if (client) {
    try {
      const client = await Cliente.findOne(query);
      const searchOrders = await Pedido.find({ cliente: client._id }).sort({
        _id: -1
      });
      return searchOrders;
    } catch (error) {
      throw new Error('No hay pedidos para este cliente');
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

async function setPaidOrder(input, id) {
  const exist = await Pedido.findById(id);
  if (!exist) throw new Error('El pedido no existe!');

  try {
    return await Pedido.findByIdAndUpdate(id, input, { new: true });
  } catch (error) {
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
  getPaidOrders,
  getDispatchOrders,
  addOrder,
  setOrder,
  setStatusOrder,
  setPaidOrder,
  deleteOrder,
  searchOrders
};

// try {
//   return await Pedido.aggregate([
//     {
//       $match: {
//         $expr: {
//           $eq: [{ $month: '$createdAt' }, { $month: new Date() }]
//         },
//         estado: 'PENDIENTE'
//       }
//     },
//     { $sort: { _id: -1 } },
//     { $limit: 1500 },
//     {
//       $project: fields
//     }
//   ]);
// } catch (error) {
//   throw new Error('❌Error! ❌');
// }
