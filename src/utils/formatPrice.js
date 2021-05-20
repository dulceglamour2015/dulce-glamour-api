function formatPrice(value) {
  return Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

module.exports = {
  formatPrice
};
