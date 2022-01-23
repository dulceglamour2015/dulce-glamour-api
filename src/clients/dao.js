const { Cliente } = require('./collection');
const { District } = require('./district.model');
const { findAllOrders } = require('../orders/orders.lib');
const { loaderFactory } = require('../utils/loaderFactory');
const { getMongooseSelectionFromReq } = require('../utils/selectFields');
const graphqlErrorRes = require('../utils/graphqlErrorRes');
const { ApolloError } = require('apollo-server-express');

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

  getClients: async ({ info }) => {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.id;

    return new Promise((res, rej) =>
      Cliente.find()
        .select(fields)
        .sort({ nombre: 1 })
        .exec((error, result) => {
          if (error) return rej(graphqlErrorRes[400]);
          return res(result);
        })
    );
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
    // try {
    //   const res = await District.find().select(fields).sort({ _id: -1 });
    //   return res;
    // } catch (error) {
    //   throw new Error('No se econtraron distritos');
    // }
  },
  lastOrders: async ({ info, id }) => {
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
    console.log('After promise');

    return new Promise((res, rej) => {
      const newClient = new Cliente(input);
      newClient.id = newClient._id;

      newClient
        .save()
        .then((savedClient) => res(savedClient))
        .catch((error) => {
          console.log(error);
          return rej(error);
        });
    });

    // try {
    //   const nuevoCliente = new Cliente(input);
    //   nuevoCliente.id = nuevoCliente._id;
    //   await nuevoCliente.save();
    //   return nuevoCliente;
    // } catch (error) {
    //   throw new Error('No se pudo registrar al cliente');
    // }
  },
  updateClient: async ({ id, input }) => {
    if (input.nombre) {
      const exist = await Cliente.findOne({ nombre: input.nombre });
      if (exist) throw new Error('El cliente ya existe!');
    }

    return new Promise((res, rej) =>
      Cliente.findByIdAndUpdate({ _id: id }, input, { new: true }).exec(
        (error, result) => {
          if (error) return rej(graphqlErrorRes[400]);
          return res(result);
        }
      )
    );

    // try {
    //   return await Cliente.findOneAndUpdate({ _id: id }, input, {
    //     new: true,
    //   });
    // } catch (error) {
    //   throw new Error('No se pudo actualizar al cliente');
    // }
  },
  deleteClient: async ({ id }) => {
    return new Promise((res, rej) =>
      Cliente.findByIdAndDelete({ _id: id }).exec((error, result) => {
        if (error) return rej('Cannot delete client');
        return res('Cliente Eliminado');
      })
    );
    // try {
    //   await Cliente.findOneAndDelete({ _id: id });
    //   return 'Cliente Eliminado';
    // } catch (error) {
    //   throw new Error('No se pudo eliminar al cliente');
    // }
  },
};
