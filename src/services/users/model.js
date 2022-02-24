'use strict';
const dto = require('./dao');

module.exports = {
  getUsers: () => dto.getUsers(),
  getUser: (id) => dto.getUser(id),
  getOrdersUsers: (userId, info) => dto.getOrdersUser(userId, info),
  getCurrentOrders: (current, info) => dto.getCurrentOrders(current, info),
  getIndicatorToday: (current, id) => dto.getIndicatorToday(current, id),
  getProductivityOrdersUsers: (date) => dto.getProductivityOrdersUsers(date),
  loaderUsersOrder: (parent, loader) => dto.loaderUsersOrder(parent, loader),
  login: ({ username, password }) => dto.login({ username, password }),
  addUser: (input) => dto.addUser(input),
  deleteUser: (id) => dto.deleteUser(id),
  updateUser: (id, input) => dto.updateUser(id, input),
  updatePassword: (id, password) => dto.updatePassword(id, password),
  getLastOrdersUser: (userId) => dto.getLastOrdersUser(userId),
};
