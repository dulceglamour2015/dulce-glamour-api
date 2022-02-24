const model = require('./model');

module.exports = {
  Cliente: {
    provincia: async (parent, _args, { loader }, _info) => {
      return await model.loaderDistricts(loader, parent.provincia);
    },
  },
  Query: {
    obtenerClientes: async (_, __, ___, info) => {
      return await model.getClients(info);
    },
    obtenerCliente: async (_, { id }) => {
      return await model.getClient(id);
    },
    getDistricts: async (_, __, ___, info) => {
      return await model.allDistricts(info);
    },
    getLast20Orders: async (_, { clientId }, __, info) => {
      return await model.lastOrdersClient(clientId, info);
    },
  },
  Mutation: {
    nuevoCliente: async (_, { input }, __) => {
      return await model.addClient(input);
    },
    actualizarCliente: async (_, { id, input }, __) => {
      return await model.updateClient(id, input);
    },
    eliminarCliente: async (_, { id }, __) => {
      return await model.deleteClient(id);
    },
  },
};
