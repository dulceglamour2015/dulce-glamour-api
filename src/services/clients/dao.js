const { Cliente } = require('./collection');
const { District } = require('./district-collection');
const { findAllOrders } = require('../orders/lib');
const { loaderFactory } = require('../../utils/loaderFactory');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');
const graphqlErrorRes = require('../../utils/graphqlErrorRes');
const { ApolloError } = require('apollo-server-express');
const { getPaginateOptions } = require('../../config');
const { paginatedClients } = require('./lib');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');

module.exports = {
  loaderDistricts: async ({ loader, provincia }) => {
    if (provincia !== undefined) {
      try {
        return await loaderFactory(loader, District, provincia);
      } catch (error) {
        throw new Error('Error al cargar provincias');
      }
    }

    return null;
  },
  loaderClientsOrder: async function (parent, loader) {
    try {
      return await loaderFactory(loader, Cliente, parent);
    } catch (error) {
      throw new Error('Error con el loader de Clientes!');
    }
  },

  getClients: async ({ info, search }) => {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;

    try {
      if (search) {
        return await Cliente.find({ $text: { $search: search } });
      }
      return await Cliente.find().sort({ nombre: 1 }).limit(100);
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  getPaginatedClients: async ({ search, page }) => {
    try {
      const options = getPaginateOptions({ page, limit: 6 });

      if (search) {
        return paginatedClients({
          query: {
            $text: { $search: search },
          },
          options,
        });
      }

      return paginatedClients({ options });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
  getClient: async ({ id }) => {
    return new Promise((res, rej) =>
      Cliente.findById(id).exec((error, result) => {
        if (error) return rej(graphqlErrorRes[400]);
        return res(result);
      })
    );
  },
  allDistricts: async ({ info }) => {
    const fields = getMongooseSelectionFromReq(info);

    return new Promise((res, rej) =>
      District.find()
        .select(fields)
        .sort({ _id: -1 })
        .exec((error, result) => {
          if (error) return rej(graphqlErrorRes[400]);
          return res(result);
        })
    );
  },
  lastOrdersClient: async ({ info, id }) => {
    const fields = getMongooseSelectionFromReq(info);
    try {
      return await findAllOrders(
        { estado: 'PAGADO', cliente: id },
        { fields, limit: 40 }
      );
    } catch (error) {
      throw new Error('No se encontraron pedidos!');
    }
  },

  addClient: async ({ input }) => {
    const { cedula, nombre } = input;
    const exist = await Cliente.findOne({ cedula, nombre });
    if (exist) throw new ApolloError('El cliente ya esta registrado');

    return new Promise((res, rej) => {
      const newClient = new Cliente(input);
      newClient.id = newClient._id;

      newClient
        .save()
        .then((savedClient) => res(savedClient))
        .catch((error) => {
          return rej(error);
        });
    });
  },
  updateClient: async ({ id, input }) => {
    try {
      return await Cliente.findByIdAndUpdate({ _id: id }, input, { new: true });
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
