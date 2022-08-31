const { Cliente } = require('./collection');
const { District } = require('./district-collection');
const { findAllOrders } = require('../orders/lib');
const { loaderFactory } = require('../../utils/loaderFactory');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');
const graphqlErrorRes = require('../../utils/graphqlErrorRes');
const { ApolloError } = require('apollo-server-express');
const { getPaginateOptions } = require('../../config');
const lib = require('./lib');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');

module.exports = {
  loaderDistricts: async ({ loader, provincia }) => {
    if (provincia !== undefined) {
      try {
        return await loaderFactory(loader, District, provincia);
      } catch (error) {
        handleErrorResponse({ errorMsg: error });
      }
    }

    return null;
  },
  loaderClientsOrder: async function (parent, loader) {
    try {
      return await loaderFactory(loader, Cliente, parent);
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  getClients: async ({ info, search }) => {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;

    try {
      if (search) {
        const aggregate = [
          {
            $search: {
              index: 'clients_name_search',
              text: {
                query: search,
                path: 'nombre',
              },
            },
          },
        ];
        const resAggregate = await Cliente.aggregate(aggregate);

        return resAggregate
          .filter((client) => client.deleted !== true)
          .map((client) => ({
            ...client,
            id: client._id,
          }));
      }

      return await Cliente.find({ deleted: false })
        .sort({ nombre: 1 })
        .limit(15);
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  getPaginatedClients: async ({ search, page }) => {
    try {
      const options = getPaginateOptions({ page, limit: 10 });

      if (search) {
        const searchOptions = getPaginateOptions({
          page,
          limit: 10,
          sort: { score: { $meta: 'textScore' } },
          projection: { score: { $meta: 'textScore' } },
        });

        return lib.getPaginatedClients({
          query: {
            $text: { $search: search },
          },
          options: searchOptions,
        });
      }

      return lib.getPaginatedClients({ options });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
  getClient: async ({ id }) => {
    try {
      return await Cliente.findById(id);
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  getClientByDNI: async ({ dni }) => {
    try {
      return await Cliente.findOne({ cedula: dni });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
  allDistricts: async ({ info }) => {
    const fields = getMongooseSelectionFromReq(info);

    try {
      return await District.find().select(fields).sort({ nombre: 1 });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
  getLastOrdersClient: async ({ info, id }) => {
    const fields = getMongooseSelectionFromReq(info);
    try {
      return await findAllOrders({ estado: 'PAGADO', cliente: id }, { fields });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  addClient: async ({ input }) => {
    const { cedula, nombre } = input;
    const isExists = await Cliente.findOne({ cedula, nombre });
    if (isExists) handleErrorResponse({ errorMsg: 'Client already register' });

    try {
      const newClient = new Cliente(input);
      newClient.id = newClient._id;

      await newClient.save();

      return newClient;
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
  updateClient: async ({ id, input, current }) => {
    try {
      return await Cliente.findByIdAndUpdate(
        { _id: id },
        { ...input, updatedBy: current.id },
        { new: true }
      );
    } catch (error) {
      handleErrorResponse({ errorMsg: error, message: 'BAD_RESQUEST' });
    }
  },

  deleteClient: async ({ id, userId }) => {
    try {
      await Cliente.deleteById(id, userId);
      return 'Success';
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
};
