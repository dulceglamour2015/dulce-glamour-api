const multiple = (orders) => {
  return orders.map((order) => {
    order.id = order._id;

    return order;
  });
};

module.exports = { multiple };
