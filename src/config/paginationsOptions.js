function getPaginateOptions({ page, sort = { _id: -1 }, limit = 12, offset }) {
  const options = {
    page,
    limit,
    sort,
  };

  return options;
}

module.exports = getPaginateOptions;
