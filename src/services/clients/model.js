const dao = require('./dao');

module.exports = {
  async getPaginatedClients({ search, page }) {
    return dao.getPaginatedClients({ search, page });
  },

  async getClients(info) {
    return dao.getClients({ info });
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

  async lastOrdersClient(id, info) {
    return dao.lastOrdersClient({ info, id });
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
