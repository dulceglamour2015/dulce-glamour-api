const { Categoria } = require('../../database/Categoria');

module.exports = {
  Query: {
    obtenerCategorias: async (_, __, ___) => {
      try {
        return await Categoria.find().sort({ _id: -1 });
      } catch (error) {
        throw new Error('No hay categorias!');
      }
    },
    obtenerCategoria: async (_, { id }, __) => {
      try {
        return await Categoria.findById(id);
      } catch (error) {
        throw new Error('No existe esa categoria');
      }
    },
  },
  Mutation: {
    nuevaCategoria: async (_, { input }, __) => {
      const categoriaExistente = await Categoria.findOne({
        nombre: input.nombre,
      });
      if (categoriaExistente) throw new Error('Categoria ya existe');
      try {
        const categoria = new Categoria(input);
        categoria.id = categoria._id;
        await categoria.save();
        return categoria;
      } catch (error) {
        throw new Error('Error! No se pudo crear');
      }
    },
    actualizarCategoria: async (_, { id, input }, __) => {
      try {
        return await Categoria.findByIdAndUpdate(id, input, { new: true });
      } catch (error) {
        throw new Error('No se pudo actulizar categoria');
      }
    },
    eliminarCategoria: async (_, { id }, __) => {
      try {
        await Categoria.findByIdAndDelete(id);
        return 'Categoria eliminada';
      } catch (error) {
        throw new Error('Error! No se pudo eliminar categoria');
      }
    },
  },
};
