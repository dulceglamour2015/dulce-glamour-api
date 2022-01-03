const {
  loaderDistricts,
  getClients,
  getClient,
  allDistricts,
  lastOrders,
  addClient,
  updateClient,
  deleteClient,
} = require('./dao');

module.exports = {
  Cliente: {
    provincia: async (parent, args, { loader }, info) => {
      return await loaderDistricts({ loader, provincia: parent.provincia });
    },
  },
  Query: {
    obtenerClientes: async (_, __, ___, info) => {
      return await getClients({ info });
    },
    obtenerCliente: async (_, { id }) => {
      return await getClient({ id });
    },
    getDistricts: async (_, __, ___, info) => {
      return await allDistricts({ info });
    },
    getLast20Orders: async (_, { clientId }, __, info) => {
      return await lastOrders({ info, id: clientId });
    },
  },
  Mutation: {
    nuevoCliente: async (_, { input }, __) => {
      return await addClient({ input });
    },
    actualizarCliente: async (_, { id, input }, __) => {
      return await updateClient({ id, input });
    },
    eliminarCliente: async (_, { id }, __) => {
      return await deleteClient({ id });
    },
  },
};
