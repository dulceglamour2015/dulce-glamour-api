const dao = require('./dao');

module.exports = {
  getOrders({ current, page, type, status }) {
    return dao.getOrders({ current, page, type, status });
  },
  getOrder(id) {
    return dao.getOrder(id);
  },
  getOrdersToAttend(page) {
    return dao.getOrdersToAttend(page);
  },
  getOrdersToPackIn(page) {
    return dao.getOrdersToPackIn(page);
  },
  getOrdersToSend(page) {
    return dao.getOrdersToSend(page);
  },
  getOrdersDispatched(page) {
    return dao.getOrdersDispatched(page);
  },
  searchOrders(search) {
    return dao.searchOrders(search);
  },
  addOrder(input, current) {
    return dao.addOrder(input, current);
  },
  setOrderWithStock({ input, prev, id }) {
    return dao.setOrderWithStock({ input, prev, id });
  },
  setOrderWithoutStock(input, id) {
    return dao.setOrderWithoutStock(input, id);
  },
  setPaidOrder(input, id) {
    return dao.setPaidOrder(input, id);
  },
  setAttendOrder(id, current) {
    return dao.setAttendOrder(id, current);
  },
  setPackinOrder(id, current) {
    return dao.setPackinOrder(id, current);
  },
  setToSendOrder(ids) {
    return dao.setToSendOrder(ids);
  },
  deleteOrder(id) {
    return dao.deleteOrder(id);
  },
  setStatusOrder(input, id) {
    return dao.setStatusOrder(input, id);
  },
};
