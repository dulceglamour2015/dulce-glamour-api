const { Provider } = require('./collection');
const { multiple: multipleDTO } = require('./dto');
const { getPaginatedDocument } = require('../../utils/getPaginatedDocument');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');
const getPaginateOptions = require('../../config/paginationsOptions');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');

module.exports = {
  findAllProviders: async ({ page, search }) => {
    const options = getPaginateOptions({
      page,
      sort: { _id: -1 },
    });
    const queryOptions = { dtoFn: multipleDTO, model: Provider, options };

    if (search) {
      const searchOptions = getPaginateOptions({
        ...options,
        sort: { score: { $meta: 'textScore' } },
        projection: { score: { $meta: 'textScore' } },
      });
      const query = { $text: { $search: search } };

      queryOptions.options = searchOptions;
      queryOptions.query = query;
    }

    try {
      const { docs, pageInfo } = await getPaginatedDocument(queryOptions);

      return { docs, pageInfo };
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  getSelectProviders: async ({ info }) => {
    const select = getMongooseSelectionFromReq(info);

    try {
      const providers = await Provider.find()
        .select(select)
        .sort({ _id: -1 })
        .lean();
      const mapProviders = multipleDTO(providers);

      return mapProviders;
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  findProvider: async ({ id }) => {
    try {
      return await Provider.findById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  },
  createProvider: async ({ input }) => {
    const existProvider = await Provider.findOne({ nombre: input.nombre });
    if (existProvider) throw new Error('Proveedor ya existe');
    try {
      const provider = new Provider(input);
      provider.id = provider._id;
      await provider.save();
      return provider;
    } catch (error) {
      console.log(error);
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
