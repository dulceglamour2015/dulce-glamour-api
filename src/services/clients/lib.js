const { Cliente } = require('./collection');
const dto = require('./dto');

module.exports = {
  getPaginatedClients: async ({ query = {}, options }) => {
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

  getPaginatedAggregateClients: async ({ aggregate, options }) => {
    const clientAggregate = Cliente.aggregate(aggregate);

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
    } = await Cliente.aggregatePaginate(clientAggregate, options);

    return {
      clients: dto.multiple(docs),
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
