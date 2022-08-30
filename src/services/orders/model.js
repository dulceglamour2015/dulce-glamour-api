const dao = require('./dao');

module.exports = {
  getOrders({ current, page, type, status, filters }) {
    return dao.getOrders({ current, page, type, status, filters });
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
  createOrder(input, current) {
    return dao.createOrder(input, current);
  },
  updateOrderWithStock({ input, id }) {
    return dao.updateOrderWithStock({ input, id });
  },
  updateOrderWithoutStock(input, id) {
    return dao.updateOrderWithoutStock(input, id);
  },
  updatePaymentOrder(input, id) {
    return dao.updatePaymentOrder(input, id);
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
  removeOrder(id) {
    return dao.removeOrder(id);
  },
  updateStatusOrder(input, id) {
    return dao.updateStatusOrder(input, id);
  },
};
