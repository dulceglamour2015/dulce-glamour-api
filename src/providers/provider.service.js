const { Provider } = require('./provider.model');
const { getMongooseSelectionFromReq } = require('../utils/selectFields');

module.exports = {
  findAllProviders: async ({ info }) => {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;
    try {
      return await Provider.find().select(fields).sort({ _id: -1 });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  findOneProvider: async ({ id }) => {
    try {
      return await Provider.findById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  },
  createProvider: async ({ input }) => {
    const existProvider = await Provider.findOne({ ruc: input.ruc });
    if (existProvider) throw new Error('Proveedor ya existe');
    try {
      const provider = new Provider(input);
      provider.id = provider._id;
      await provider.save();
      return provider;
    } catch (error) {
      throw new Error('Error! No se pudo crear');
    }
  },
  setProvider: async ({ id, input }) => {
    try {
      return await Provider.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
    } catch (error) {
      throw new Error('No se pudo actualizar');
    }
  },
  removeProvider: async ({ id }) => {
    try {
      await Provider.findOneAndDelete({ _id: id });
      return 'Proveedor Eliminado';
    } catch (error) {
      throw new Error('No se pudo eliminar');
    }
  },
};
