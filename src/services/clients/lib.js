const { Cliente } = require('./collection');

module.exports = {
  paginatedClients: async ({ query = {}, options }) => {
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
    } = await Cliente.paginate(query, options);

    return {
      clients: docs,
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
  },
};
