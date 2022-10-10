const { Categoria } = require('./collection');
const { formatNumber } = require('../../utils/formatNumber');
const { formatPrice } = require('../../utils/formatPrice');
const { getPercentageTotal } = require('./lib');

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
      const categoryProducts = item.productos;
      return {
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

  const rows = data.map((item) => {
    const id = item.categoria._id;
    const name = item.categoria.nombre;
    const categoryProducts = item.productos;
    const countProducts = item.productos.length;
    const vn = categoryProducts.reduce(
      (acc, item) => (acc += item.existencia * item.precioCompra),
      0
    );
    const vf = categoryProducts.reduce(
      (acc, item) => (acc += item.existencia * item.precio),
      0
    );
    const stock = categoryProducts.reduce(
      (acc, item) => (acc += item.existencia),
      0
    );

    return {
      id,
      name,
      countProducts,
      stock,
      vn,
      vf,
      vnpercentage: getPercentageTotal(vn, netValue),
      vfpercentage: getPercentageTotal(vf, futureValue),
      totalpercentage: getPercentageTotal(vn - vf, futureValue - netValue),
    };
  });

  const stats = [
    {
      id: 'All',
      title: `Categorias ${rows.length}`,
      subtitle: `Stock ${totalProducts}`,
      value: formatNumber(totalStock),
    },
    {
      id: 'Net',
      title: 'Valor Neto',
      subtitle: 'PC * STOCK',
      value: formatPrice(netValue),
    },
    {
      id: 'Future',
      title: 'Valor Futuro',
      subtitle: 'PV * FUTURO',
      value: formatPrice(futureValue),
    },
    {
      id: 'Margin',
      title: 'Margen Bruto',
      subtitle: 'VF - VN',
      value: formatPrice(futureValue - netValue),
    },
  ];

  return { rows, stats };
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
      categoria: { nombre: 1, _id: 1 },
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
