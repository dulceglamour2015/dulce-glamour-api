const { Categoria } = require('./collection');

const getPaginatedCategories = async ({ query = {}, options }) => {
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
  } = await Categoria.paginate(query, options);

  return {
    categories: docs,
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
};

function getCategoriesInventoryResponse(data) {
  const inventory = data
    .map((item) => {
      const categoryName = item.categoria.nombre;
      const categoryProducts = item.productos;

      return {
        name: categoryName,
        countProducts: categoryProducts.length,
        stock: categoryProducts.reduce(
          (acc, item) => (acc += item.existencia),
          0
        ),
        vn: categoryProducts.reduce(
          (acc, item) => (acc += item.existencia * item.precioCompra),
          0
        ),
        vf: categoryProducts.reduce(
          (acc, item) => (acc += item.existencia * item.precio),
          0
        ),
      };
    })
    .sort((a, b) => b.vn - a.vn);

  const futureValue = inventory.reduce((acc, item) => (acc += item.vf), 0);
  const netValue = inventory.reduce((acc, item) => (acc += item.vn), 0);
  const totalProducts = inventory.reduce(
    (acc, item) => (acc += item.countProducts),
    0
  );

  const totalStock = inventory.reduce((acc, item) => (acc += item.stock), 0);

  return {
    inventory,
    futureValue,
    netValue,
    totalProducts,
    totalStock,
  };
}

const AGGREGATEOPTIONCATEGORIESINVENTORY = [
  {
    $match: { deleted: false },
  },
  {
    $lookup: {
      from: 'products',
      localField: '_id',
      foreignField: 'categoria',
      as: 'categorieProducts',
    },
  },
  { $unwind: '$categorieProducts' },

  {
    $match: {
      $and: [
        { 'categorieProducts.existencia': { $gt: 0 } },
        { 'categorieProducts.deleted': false },
      ],
    },
  },
  {
    $group: {
      _id: '$_id',
      categoria: { $mergeObjects: '$$ROOT' },
      productos: { $push: '$categorieProducts' },
    },
  },
  {
    $project: {
      categoria: { nombre: 1 },
      productos: {
        nombre: 1,
        existencia: 1,
        precio: 1,
        precioCompra: 1,
        precio: 1,
      },
    },
  },
  {
    $sort: { 'root.nombre': 1 },
  },
];

module.exports = {
  getCategoriesInventoryResponse,
  getPaginatedCategories,
  AGGREGATEOPTIONCATEGORIESINVENTORY,
};
