const { Categoria } = require('../database/Categoria');
const { Products } = require('../database/Products');
const { loaderFactory } = require('../utils/loaderFactory');
const { getMongooseSelectionFromReq } = require('../utils/selectFields');

async function getAllProducts(info) {
  const fields = getMongooseSelectionFromReq(info);
  delete fields.id;

  try {
    return await Products.find().select(fields).sort({ _id: -1 });
  } catch (error) {
    throw new Error('No se pudieron obtener los productos');
  }
}

async function getProduct(id) {
  try {
    return await Products.findById(id);
  } catch (error) {
    throw new Error('Producto no encontrado');
  }
}

async function getCategorieProduct(parent, loader) {
  try {
    return await loaderFactory(loader, Categoria, parent);
  } catch (error) {
    throw new Error('Error al cargar categorias');
  }
}

async function addProduct(input) {
  const exist = await Products.findOne({ nombre: input.nombre });
  if (exist) throw new Error(`El producto: ${input.nombre} ya existe`);
  try {
    const product = new Products(input);
    product.id = product._id;
    await product.save();
    return product;
  } catch (error) {
    throw new Error('No se pudo crear el producto');
  }
}

async function addCombo(input) {
  const exist = await Products.findOne({ nombre: input.nombre });
  if (exist) throw new Error(`El producto ${input.nombre} ya existe`);

  if (Boolean(input.combo)) {
    for await (const articulo of input.productosCombo) {
      const { id } = articulo;
      const producto = await Products.findById(id);

      if (input.existencia > producto.existencia) {
        throw new Error(
          `El articulo: ${producto.nombre} excede la cantidad disponible`
        );
      }

      producto.existencia = producto.existencia - input.existencia;
      await producto.save();
    }
  }
  try {
    const newProducto = new Products(input);
    newProducto.id = newProducto._id;
    await newProducto.save();
    return newProducto;
  } catch (error) {
    throw new Error('No se pudo crear el producto');
  }
}

async function updateProduct(id, input) {
  try {
    return await Products.findOneAndUpdate({ _id: id }, input, {
      new: true
    });
  } catch (error) {
    throw new Error('No se pudo actualizar el producto');
  }
}

async function deleteProduct(id) {
  const dbProduct = await Products.findById(id);

  if (Boolean(dbProduct.combo)) {
    for await (const articulo of dbProduct.productosCombo) {
      const { id } = articulo;
      const product = await Products.findById(id);

      product.existencia = product.existencia + dbProduct.existencia;

      await product.save();
    }
  }
  try {
    await Products.findOneAndDelete({ _id: id });
    return 'Producto Eliminado';
  } catch (error) {
    throw new Error('No se pudo eliminar el producto');
  }
}

module.exports = {
  getCategorieProduct,
  getAllProducts,
  getProduct,
  addProduct,
  addCombo,
  updateProduct,
  deleteProduct
};
