function getPaginateOptions({
  page,
  sort = { _id: -1 },
  limit = 12,
  populate,
}) {
  const options = {
    page,
    limit,
    sort,
    populate,
  };

  return options;
}

module.exports = getPaginateOptions;
