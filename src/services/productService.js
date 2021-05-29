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
    const product = await Products.findById(id);
    return product;
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

async function setCombo({ id, input, prev }) {
  if (input.nombre) {
    const exist = await Products.findOne({ nombre: input.nombre });
    if (exist) throw new Error(`El combo ${input.nombre} ya existe!`);
  }

  for await (const articulo of input.productosCombo) {
    const { id } = articulo;
    const product = await Products.findById(id);

    if (input.existencia > product.existencia)
      throw new Error(`
        El producto ${product.nombre} excede la cantidad disponible!
      `);
  }

  if (prev) {
    try {
      for await (const articulo of prev.productosCombo) {
        const { id } = articulo;
        const prevProduct = await Products.findById(id);

        prevProduct.existencia = prevProduct.existencia + prev.existencia;

        await prevProduct.save();
      }
    } catch (e) {
      throw new Error('No se retauro el stock!');
    }
  }

  try {
    for await (const articulo of input.productosCombo) {
      const { id } = articulo;
      const product = await Products.findById(id);

      product.existencia = product.existencia - input.existencia;

      await product.save();
    }
  } catch (error) {
    throw new Error('No se pudo descontar del stock');
  }

  try {
    return await Products.findByIdAndUpdate(id, input, { new: true });
  } catch (error) {
    throw new Error('No se pudo editar el combo');
  }
}

async function updateProduct(id, input) {
  if (input.nombre) {
    const exist = await Products.findOne({ nombre: input.nombre });
    if (exist) throw new Error(`El producto ${exist.nombre} ya existe!`);
  }
  try {
    return await Products.findOneAndUpdate({ _id: id }, input, {
      new: true,
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
  setCombo,
  updateProduct,
  deleteProduct,
};
