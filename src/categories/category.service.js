const { Categoria } = require('./category.model');

module.exports = {
  getCategories: async () => {
    try {
      return await Categoria.find().sort({ _id: -1 });
    } catch (error) {
      throw new Error('No hay categorias!');
    }
  },
  getCategory: async ({ id }) => {
    try {
      return await Categoria.findById(id);
    } catch (error) {
      throw new Error('No existe esa categoria');
    }
  },
  addCategory: async ({ input }) => {
    const exist = await Categoria.findOne({
      nombre: input.nombre,
    });

    if (exist) throw new Error('Categoria ya existe');

    try {
      const categoria = new Categoria(input);
      categoria.id = categoria._id;
      await categoria.save();
      return categoria;
    } catch (error) {
      throw new Error('Error! No se pudo crear');
    }
  },
  updateCategory: async ({ id, input }) => {
    try {
      return await Categoria.findByIdAndUpdate(id, input, { new: true });
    } catch (error) {
      throw new Error('No se pudo actulizar categoria');
    }
  },
  deleteCategory: async ({ id }) => {
    try {
      await Categoria.findByIdAndDelete(id);
      return 'Categoria eliminada';
    } catch (error) {
      throw new Error('Error! No se pudo eliminar categoria');
    }
  },

  catergoriesWithProducts: async () => {
    try {
      const res = await Categoria.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'categoria',
            as: 'productos',
          },
        },
      ]);
      const resFilter = await Categoria.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'categoria',
            as: 'categorieProducts',
          },
        },
        { $unwind: '$categorieProducts' },
        {
          $match: {
            'categorieProducts.existencia': { $gt: 0 },
            'categorieProducts.nombre': { $not: { $regex: /^TEST \d/ } },
          },
        },
        {
          $group: {
            _id: '$_id',
            root: { $mergeObjects: '$$ROOT' },
            productos: { $push: '$categorieProducts' },
          },
        },
      ]);

      const response = resFilter.map((item) => ({
        nombre: item.root.nombre,
        productos: item.productos,
      }));

      return response;
    } catch (error) {
      console.error(error);
    }
  },
};
