const { formatPrice } = require('../../utils/formatPrice');

const multiple = (orders) => {
  return orders.map((order) => {
    return {
      id: order._id,
      client: {
        email: order.client.email,
        fullName: order.client.fullName,
        phone: order.client.phone,
        dni: order.client.dni,
      },
      shipping: {
        address: order.shipping.address,
        reference: order.shipping.reference,
        city: order.shipping.city,
        province: order.shipping.province,
      },
      lineProducts: order.lineProducts.map((product) => ({
        id: product.id,
        quantity: product.quantity,
        price: product.price,
        name: product.name,
        image: product.image,
        price: { amount: product.price, formatted: formatPrice(product.price) },
      })),
      shippingTotal: order.shippingTotal,
      discount: order.discount,
      status: order.status,
      description: order.description,
      totalUniqueItems: order.totalUniqueItems,
      paidType: order.paidType,
      paidDescription: order.paidDescription,
      paidImage: order.paidImage,
      paidUser: order.paidUser,
      total: order.total,
      createdAt: order.createdAt,
    };
  });
};

const single = (order) => {
  return {
    id: order._id,
    client: {
      email: order.client.email,
      fullName: order.client.fullName,
      phone: order.client.phone,
      dni: order.client.dni,
    },
    shipping: {
      address: order.shipping.address,
      reference: order.shipping.reference,
      city: order.shipping.city,
      province: order.shipping.province,
    },
    lineProducts: order.lineProducts.map((product) => ({
      id: product.id,
      quantity: product.quantity,
      price: product.price,
      name: product.name,
      image: product.image,
      price: { amount: product.price, formatted: formatPrice(product.price) },
    })),
    shippingTotal: order.shippingTotal,
    discount: order.discount,
    status: order.status,
    description: order.description,
    totalUniqueItems: order.totalUniqueItems,
    paidType: order.paidType,
    paidDescription: order.paidDescription,
    paidImage: order.paidImage,
    paidUser: order.paidUser,
    total: order.total,
    createdAt: order.createdAt,
  };
};

module.exports = { multiple, single };
