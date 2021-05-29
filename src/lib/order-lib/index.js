const { Pedido } = require('../../database/Pedido');
const { Products: Producto } = require('../../database/Products');

async function findAllOrderPaginate(query, options) {
  try {
    const { docs, totalDocs, totalPages, nextPage } = await Pedido.paginate(
      query,
      options
    );
    return {
      pedidos: docs,
      pageInfo: {
        totalDocs,
        totalPages,
        nextPage,
      },
    };
  } catch (error) {
    throw new Error('No se pudieron obtener los pedidos!');
  }
}
async function findAllOrders(query, { fields, sort = { _id: -1 } }) {
  try {
    return await Pedido.find(query).select(fields).sort(sort);
  } catch (error) {
    throw new Error('No se pudieron obtener los pedidos');
  }
}

async function order(query) {
  try {
    return await Pedido.findOne(query);
  } catch (error) {
    throw new Error('No se pudo obtener el pedido');
  }
}
async function getCurrentDayOrders() {
  const startOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(
    new Date().setUTCHours(23, 59, 59, 999)
  ).toISOString();
  let createdAt = {
    $gte: startOfDay,
    $lte: endOfDay,
  };
  try {
    return await Pedido.find(createdAt).select(select).sort({ _id: -1 });
  } catch (error) {
    throw new Error('No se pudo obtener los pedidos del dia');
  }
}
async function saveOrder(input, current) {
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

async function updateOrder(id, input) {
  try {
    return await Pedido.findOneAndUpdate({ _id: id }, input, {
      new: true,
    });
  } catch (error) {
    throw new Error(`No se pudo editar el pedido ${id}`);
  }
}

async function removeOrder(id) {
  try {
    await Pedido.findOneAndDelete({ _id: id });
    return 'Pedido Eliminado';
  } catch (error) {
    throw new Error('❌Error! ❌');
  }
}

async function discountProductsStock(products) {
  for await (const product of products) {
    const { id } = product;
    try {
      const dbProduct = await Producto.findById(id);
      if (product.cantidad > dbProduct.existencia) {
        throw new Error(
          `El producto: ${dbProduct.nombre} excede la cantidad disponible`
        );
      }
      dbProduct.existencia = dbProduct.existencia - product.cantidad;
      await dbProduct.save();
    } catch (error) {
      throw new Error('No se pudo descontar los productos del stock!');
    }
  }
}

async function restoreProductsStock(products) {
  for await (const product of products) {
    const { id } = product;
    try {
      const dbProduct = await Producto.findById(id);
      dbProduct.existencia = dbProduct.existencia + product.cantidad;
      await dbProduct.save();
    } catch (error) {
      throw new Error('No se pudo restaurar el stock de productos');
    }
  }
}

module.exports = {
  findAllOrderPaginate,
  findAllOrders,
  order,
  getCurrentDayOrders,
  saveOrder,
  updateOrder,
  removeOrder,
  discountProductsStock,
  restoreProductsStock,
};
