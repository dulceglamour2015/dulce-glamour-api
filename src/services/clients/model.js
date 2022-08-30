const dao = require('./dao');

module.exports = {
  async getPaginatedClients({ search, page }) {
    return dao.getPaginatedClients({ search, page });
  },

  async getClientByDNI({ dni }) {
    return dao.getClientByDNI({ dni });
  },

  async getClients({ search, info }) {
    return dao.getClients({ search, info });
  },

  async getClient(id) {
    return dao.getClient({ id });
  },

  async allDistricts(info) {
    return dao.allDistricts({ info });
  },
  async loaderDistricts(loader, provincia) {
    return dao.loaderDistricts({ loader, provincia });
  },

  async getLastOrdersClient(id, info) {
    return dao.getLastOrdersClient({ info, id });
  },

  async addClient(input) {
    return dao.addClient({ input });
  },

  async updateClient(id, input) {
    return dao.updateClient({ id, input });
  },
  async deleteClient({ id, userId }) {
    return dao.deleteClient({ id, userId });
  },
  async loaderClientsOrders(parent, loader) {
    return dao.loaderClientsOrder(parent, loader);
  },
};
