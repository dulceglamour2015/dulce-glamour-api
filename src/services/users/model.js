'use strict';
const dao = require('./dao');

module.exports = {
  getUsers: () => dao.getUsers(),
  getUser: (id) => dao.getUser(id),
  getOrdersUsers: (userId, info) => dao.getOrdersUser(userId, info),
  getCurrentOrders: (current, info) => dao.getCurrentOrders(current, info),
  getIndicatorToday: (current, id) => dao.getIndicatorToday(current, id),
  getProductivityOrdersUsers: (date) => dao.getProductivityOrdersUsers(date),
  getUserProductivity({ id, current }) {
    return dao.getUserProductivity({ id, current });
  },
  loaderUsersOrder: (parent, loader) => dao.loaderUsersOrder(parent, loader),
  login: ({ username, password }) => dao.login({ username, password }),
  addUser: (input) => dao.addUser(input),
  deleteUser: (id) => dao.deleteUser(id),
  updateUser: (id, input) => dao.updateUser(id, input),
  updatePassword: (id, password) => dao.updatePassword(id, password),
  getLastOrdersUser: (userId) => dao.getLastOrdersUser(userId),
};
