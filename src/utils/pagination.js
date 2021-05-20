exports.paginatedResults = async function (model, limit, page, query) {
  const p = parseInt(page);
  const l = parseInt(limit);
  const startIndex = (p - 1) * l;
  const endIndex = p * l;

  const results = {};

  if (endIndex < (await model.countDocuments().exec())) {
    results.next = {
      page: p + 1,
      limit: l,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: p - 1,
      limit: l,
    };
  }

  try {
    results.results = await model
      .find(query)
      .limit(l)
      .skip(startIndex)
      .sort({ _id: -1 })
      .exec();
    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};
