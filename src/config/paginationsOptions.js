function getPaginateOptions({
  page = 1,
  sort = { _id: -1 },
  limit = 12,
  populate,
  projection = {},
}) {
  const options = {
    page,
    limit,
    sort,
    populate,
    projection,
  };

  return options;
}

module.exports = getPaginateOptions;
