function getPercentageTotal(qtity, total) {
  const porcentege = ((qtity / total) * 100).toFixed(2);

  return Number(porcentege);
}

module.exports = { getPercentageTotal };
