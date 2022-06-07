'use strict';
const dao = require('./dao');

module.exports = {
  getUsers: () => {
    return dao.getUsers();
  },
  getUser: (id) => {
    return dao.getUser(id);
  },
  getOrdersUsers: (userId, info) => {
    return dao.getOrdersUser(userId, info);
  },
  getCurrentOrders: (current, info) => {
    return dao.getCurrentOrders(current, info);
  },
  getIndicatorToday: (current, id) => {
    return dao.getIndicatorToday(current, id);
  },
  getProductivityOrdersUsers: (date) => {
    return dao.getProductivityOrdersUsers(date);
  },
  getUserProductivity({ id, current }) {
    return dao.getUserProductivity({ id, current });
  },
  loaderUsersOrder: (parent, loader) => {
    return dao.loaderUsersOrder(parent, loader);
  },
  login: ({ username, password }) => {
    return dao.login({ username, password });
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
  getLastOrdersUser: (userId) => {
    return dao.getLastOrdersUser(userId);
  },
};
