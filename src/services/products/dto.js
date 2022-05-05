function multiple(products) {
  return products.map((product) => {
    product.id = product._id;

    return product;
  });
}

module.exports = { multiple };
