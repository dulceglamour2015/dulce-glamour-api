// const { Producto } = require('../../database/Producto');
const { Products: Producto } = require('../../database/Products');
const { Categoria } = require('../../database/Categoria');
const { paginatedResults } = require('../../utils/pagination');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');

module.exports = {
  Producto: {
    categoria: async (parent, _args, { loader }) => {
      return loader.single.load(Categoria, parent.categoria);
    }
  },
  Query: {
    obtenerProductos: async (_, { offset }, ___) => {
      try {
        const results = await paginatedResults(Producto, 50, offset, {});
        return results.results;
      } catch (error) {
        throw new Error('No se pudieron obtener los productos');
      }
    },
    allProducts: async (_, __, ___, info) => {
      const fields = getMongooseSelectionFromReq(info);
      delete fields.id;
      try {
        return await Producto.find().select(fields).sort({ _id: -1 });
      } catch (error) {
        throw new Error('No se pudieron obtener los productos');
      }
    },
    obtenerProducto: async (_, { id }) => {
      // revisar si el producto existe o no
      const producto = await Producto.findById(id);
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
      return producto;
    }
  },
  Mutation: {
    nuevoProducto: async (_, { input }) => {
      const exist = await Producto.findOne({ nombre: input.nombre });
      if (exist) throw new Error(`El producto: ${input.nombre} ya existe`);
      try {
        const producto = new Producto(input);
        producto.id = producto._id;
        await producto.save();
        return producto;
      } catch (error) {
        throw new Error('No se pudo crear el producto');
      }
    },
    nuevoCombo: async (_, { input }) => {
      const exist = await Producto.findOne({ nombre: input.nombre });
      if (exist) throw new Error('El producto ya existe');

      if (Boolean(input.combo)) {
        for await (const articulo of input.productosCombo) {
          const { id } = articulo;
          const producto = await Producto.findById(id);

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
        const newProducto = new Producto(input);
        newProducto.id = newProducto._id;
        await newProducto.save();
        return newProducto;
      } catch (error) {
        throw new Error('No se pudo crear el producto');
      }
    },
    actualizarProducto: async (_, { id, input }) => {
      try {
        return await Producto.findOneAndUpdate({ _id: id }, input, {
          new: true
        });
      } catch (error) {
        throw new Error('No se pudo actualizar el producto');
      }
    },
    eliminarProducto: async (_, { id }) => {
      const product = await Producto.findById(id);

      if (Boolean(product.combo)) {
        for await (const articulo of product.productosCombo) {
          const { id } = articulo;
          const producto = await Producto.findById(id);

          if (product.existencia > producto.existencia) {
            throw new Error(
              `El articulo: ${producto.nombre} excede la cantidad disponible`
            );
          }

          producto.existencia = producto.existencia + product.existencia;
          await producto.save();
        }
      }
      try {
        await Producto.findOneAndDelete({ _id: id });
        return 'Producto Eliminado';
      } catch (error) {
        throw new Error('No se pudo eliminar el producto');
      }
    }
  }
};
