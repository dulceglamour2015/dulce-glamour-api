const { Products } = require('./products.model');

async function findAllProducts({ filter = {}, fields, sort = { _id: -1 } }) {
  try {
    return await Products.find(filter).select(fields).sort(sort);
  } catch (error) {
    throw new Error('No se pudieron encontrar productos');
  }
}

async function getProductById(id) {
  try {
    return await Products.findById(id);
  } catch (error) {
    throw new Error(`No se pudo encontrar el producto con id: ${id}`);
  }
}

async function getProductByFilter(filter) {
  try {
    return await Products.findOne(filter);
  } catch (error) {
    throw new Error(`No se pudo encontrar el producto`);
  }
}

async function saveProduct(input) {
  try {
    const product = new Products(input);
    product.id = product._id;
    await product.save();
    return product;
  } catch (error) {
    throw new Error('No se pudo crear el producto');
  }
}

async function discountStock(products, discount) {
  for await (const product of products) {
    const { id } = product;
    try {
      const dbProduct = await Products.findById(id);
      if (discount > dbProduct.existencia) {
        throw new Error(
          `El producto: ${dbProduct.nombre} excede la cantidad disponible`
        );
      }
      dbProduct.existencia = dbProduct.existencia - discount;
      await dbProduct.save();
    } catch (error) {
      throw new Error('No se pudo descontar los productos del stock!');
    }
  }
}

async function restoreStock(products, restore) {
  try {
    for await (const articulo of products) {
      const { id } = articulo;
      const product = await Products.findById(id);

      product.existencia = product.existencia + restore;

      await product.save();
    }
  } catch (e) {
    throw new Error('No se retauro el stock!');
  }
}

async function setProductByFilter(filter, input) {
  try {
    return await Products.findOneAndUpdate(filter, input, {
      new: true,
    });
  } catch (error) {
    throw new Error('No se pudo actualizar el producto');
  }
}

async function removeProductById(id) {
  try {
    await Products.findByIdAndDelete(id);
    return 'Producto Eliminado';
  } catch (error) {
    throw new Error('No se pudo eliminar el producto');
  }
}

module.exports = {
  findAllProducts,
  getProductById,
  getProductByFilter,
  saveProduct,
  discountStock,
  restoreStock,
  setProductByFilter,
  removeProductById,
};