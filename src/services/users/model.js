'use strict';
const dao = require('./dao');

module.exports = {
  getUser: (id) => {
    return dao.getUser(id);
  },

  getUsers: ({ page, search }) => {
    return dao.getUsers({ page, search });
  },

  getProductivityUser: ({ id, current }) => {
    return dao.getProductivityUser({ id, current });
  },

  getLastOrdersUser: (userId) => {
    return dao.getLastOrdersUser(userId);
  },

  getCurrentUserOrders: (current, info) => {
    return dao.getCurrentUserOrders(current, info);
  },

  getProductivityUsersOrders: (date) => {
    return dao.getProductivityUsersOrders(date);
  },

  loaderUsersOrder: (parent, loader) => {
    return dao.loaderUsersOrder(parent, loader);
  },

  login: (input) => {
    return dao.login(input);
  },

  addUser: (input) => {
    return dao.addUser(input);
  },

  suspendUser: (id, current) => {
    return dao.suspendUser(id, current);
  },

  activateUser: (id) => {
    return dao.activateUser(id);
  },

  updateUser: (id, input) => {
    return dao.updateUser(id, input);
  },

  updatePassword: (id, password) => {
    return dao.updatePassword(id, password);
  },
};
