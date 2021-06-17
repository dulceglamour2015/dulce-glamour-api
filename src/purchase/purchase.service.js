const { Products } = require('../products/products.model');
const { Purchase } = require('../database/Purchase');

async function getAllPurchases(fields) {
  try {
    return await Purchase.find({}).sort({ _id: -1 }).select(fields);
  } catch (error) {
    throw new Error('Error!');
  }
}

async function getPurchase(id) {
  try {
    return await Purchase.findById(id);
  } catch (error) {
    throw new Error('Error!');
  }
}

async function addPurchase(input) {
  const exist = await Purchase.findOne({ factura: input.factura });
  if (exist)
    throw new Error('Ya existe un registro por ese numero de factura!');

  if (input.productos.length > 0) {
    for await (const ele of input.productos) {
      const { id, cantidad, costCompra } = ele;
      const prod = await Products.findById(id);

      prod.existencia += cantidad;
      prod.precioCompra = costCompra;
      await prod.save();
    }
  }

  try {
    const purchase = new Purchase(input);
    purchase.id = purchase._id;
    await purchase.save();
    return purchase;
  } catch (error) {
    throw new Error('Error!');
  }
}

async function deletePurchase(id) {
  const { productos } = await Purchase.findById(id);
  if (productos.length) {
    for await (const ele of productos) {
      const prod = await Products.findById(ele.id);

      prod.existencia -= ele.cantidad;
      await prod.save();
    }
  }

  try {
    await Purchase.findByIdAndDelete(id);
    return 'Compra eliminada';
  } catch (error) {
    throw new Error('No se pudo eliminar el pedido!');
  }
}

module.exports = {
  getAllPurchases,
  getPurchase,
  addPurchase,
  deletePurchase,
};
