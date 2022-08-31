const model = require('./model');

module.exports = {
  Cliente: {
    provincia: async (parent, _args, { loader }, _info) => {
      return await model.loaderDistricts(loader, parent.provincia);
    },
  },
  Query: {
    getPaginatedClients: async (_, { page, search }) => {
      return await model.getPaginatedClients({ page, search });
    },
    getClients: async (_, { search }, ___, info) => {
      return await model.getClients({ search, info });
    },
    getClient: async (_, { id }) => {
      return await model.getClient(id);
    },
    getClientByDNI: async (_, { dni }) => {
      return await model.getClientByDNI({ dni });
    },
    getDistricts: async (_, __, ___, info) => {
      return await model.allDistricts(info);
    },
    getLastOrdersClient: async (_, { clientId }, __, info) => {
      return await model.getLastOrdersClient(clientId, info);
    },
  },
  Mutation: {
    addClient: async (_, { input }, __) => {
      return await model.addClient(input);
    },
    updateClient: async (_, { id, input }, { current }) => {
      return await model.updateClient(id, input, current);
    },
    deleteClient: async (_, { id }, { current }) => {
      return await model.deleteClient({ id, userId: current.id });
    },
  },
};
