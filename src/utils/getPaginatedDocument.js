async function getPaginatedDocument({
  query = {},
  options = {},
  model,
  dtoFn,
}) {
  try {
    const {
      docs,
      totalDocs,
      totalPages,
      limit,
      page,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
      pagingCounter,
      meta,
      offset,
    } = await model.paginate(query, options);

    const data = dtoFn(docs);

    return {
      docs: data,
      pageInfo: {
        totalDocs,
        totalPages,
        limit,
        page,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
        pagingCounter,
        meta,
        offset,
      },
    };
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getPaginatedDocument };
