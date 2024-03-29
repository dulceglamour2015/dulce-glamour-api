const { isEqual } = require('lodash');

const { Cliente } = require('../clients/collection');
const { Pedido } = require('./collection');

const {
  getPaginatedOrders,
  findAllOrders,
  order,
  saveOrder,
  updateOrder,
  removeOrder,
  restoreProductsStock,
  checkProductStockFromOrder,
  discountProductsStockFromOrder,
  getFilterDate,
  getPaginatedAggreagateOrders,
  getOrdersQueryParams,
} = require('./lib');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');
const { getCurrentDateISO } = require('../../utils/formatDate');
const { getPaginateOptions } = require('../../config');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');
const { isAdmin } = require('../../utils/isAdmin');

const select = {
  cliente: 1,
  vendedor: 1,
  total: 1,
  estado: 1,
  atendido: 1,
  direccion: 1,
  createdAt: 1,
};

module.exports = {
  getOrders: async function ({ current, page, type, status, filters }) {
    try {
      const opts = getPaginateOptions({
        page,
        limit: 10,
      });
      const query = getOrdersQueryParams({ current, type, status });

      if (filters && filters.name) {
        const aggregate = [
          {
            $match: {
              ...query,
            },
          },
          {
            $lookup: {
              from: 'clientes',
              localField: 'cliente',
              foreignField: '_id',
              as: 'cliente',
            },
          },
          {
            $match: {
              'cliente.nombre': new RegExp(filters.name, 'i'),
            },
          },
          { $unwind: '$cliente' },
        ];

        const { pageInfo, pedidos } = await getPaginatedAggreagateOrders({
          aggregate,
          options: opts,
        });
        return {
          pedidos: pedidos.map((order) => {
            order.cliente = order.cliente._id;
            return order;
          }),
          pageInfo,
        };
      }

      return await getPaginatedOrders(query, opts);
    } catch (e) {
      handleErrorResponse({ errorMsg: e });
    }
  },

  getOrder: async function (id) {
    try {
      return await Pedido.findById(id);
    } catch (e) {
      handleErrorResponse({ errorMsg: e });
    }
  },

  getOrdersToAttend: async function (page) {
    const dateToQuery = getFilterDate(0, 0, 0, 0);
    const opts = {
      page,
      limit: 25,
      sort: { _id: -1 },
      prejection: select,
    };
    const query = {
      estado: 'PAGADO',
      atendido: false,
      tipoVenta: 'ENLINEA',
      fechaPago: { $gte: new Date(dateToQuery) },
    };

    return await getPaginatedOrders(query, opts);
  },

  getOrdersToPackIn: async function (page) {
    const opts = {
      page,
      limit: 25,
      sort: { _id: -1 },
      prejection: select,
    };
    const query = {
      estado: 'PAGADO',
      atendido: true,
      embalado: false,
      tipoVenta: 'ENLINEA',
      createdAt: { $gte: new Date('2021-06-01') },
    };

    return await getPaginatedOrders(query, opts);
  },

  getOrdersToSend: async function (page) {
    const opts = {
      page,
      limit: 25,
      sort: { _id: -1 },
      prejection: select,
    };
    const query = {
      estado: 'PAGADO',
      atendido: true,
      embalado: true,
      enviado: false,
      tipoVenta: 'ENLINEA',
      createdAt: { $gte: new Date('2021-06-01') },
    };

    return await getPaginatedOrders(query, opts);
  },

  getOrdersDispatched: async function (page) {
    const dateToQuery = getFilterDate(0, 0, 0, 0);
    const opts = {
      page,
      limit: 25,
      sort: { _id: -1 },
      prejection: { ...select, enviado: 1, embalado: 1 },
    };
    const query = {
      estado: 'PAGADO',
      atendido: true,
      embalado: true,
      enviado: true,
      tipoVenta: 'ENLINEA',
      fechaPago: { $gte: new Date(dateToQuery) },
    };

    return await getPaginatedOrders(query, opts);
  },

  getCanceledOrders: async function (info) {
    const fields = getMongooseSelectionFromReq(info);
    return await findAllOrders({ estado: 'ANULADO' }, { fields });
  },

  getDispatchOrders: async function (current, fields) {
    if (isAdmin(current)) {
      return await findAllOrders({ estado: 'DESPACHADO' }, { fields });
    }

    return await findAllOrders(
      { estado: 'DESPACHADO', vendedor: current.id },
      { fields }
    );
  },

  searchOrders: async function (search) {
    const options = getPaginateOptions({ page: 1, limit: 100 });
    const query = {
      estado: 'PAGADO',
      createdAt: { $gte: new Date('2021-01-01') },
    };
    const textSearch = search.client || search.seller;
    const key = Object.keys(search).map((key) => key !== undefined && key);
    const SEARCH_RESULT = {
      client: async () => {
        const aggregate = [
          {
            $match: {
              ...query,
            },
          },
          {
            $lookup: {
              from: 'clientes',
              localField: 'cliente',
              foreignField: '_id',
              as: 'cliente',
            },
          },
          {
            $match: {
              'cliente.nombre': new RegExp(textSearch, 'i'),
            },
          },
          { $unwind: '$cliente' },
        ];
        const pedidos = await Pedido.aggregate(aggregate);

        const responseOrders = pedidos.map((order) => {
          order.id = order._id;
          order.cliente = order.cliente._id;
          return order;
        });

        return responseOrders;
      },
      seller: async () => {
        const aggregate = [
          {
            $match: { ...query },
          },
          {
            $lookup: {
              from: 'usuarios',
              localField: 'vendedor',
              foreignField: '_id',
              as: 'vendedor',
            },
          },
          {
            $match: { 'vendedor.nombre': new RegExp(textSearch, 'i') },
          },
          { $unwind: '$vendedor' },
        ];
        const { pageInfo, pedidos } = await getPaginatedAggreagateOrders({
          aggregate,
          options,
        });

        const responseOrders = pedidos.map((order) => {
          order.id = order._id;
          order.vendedor = order.vendedor._id;
          return order;
        });

        return responseOrders;
      },
    };

    return await SEARCH_RESULT[key[0]]();
  },

  createOrder: async function (input, current) {
    const { cliente, tipoVenta, pedido } = input;
    const client = await Cliente.findById(cliente);
    if (!client) throw new Error('Cliente no existe');

    if (tipoVenta === 'DIRECTA') {
      if (pedido) {
        await checkProductStockFromOrder(pedido);
        await discountProductsStockFromOrder(pedido);
      }
      return await saveOrder(input, current);
    }

    if (tipoVenta === 'ENLINEA') {
      if (pedido) await checkProductStockFromOrder(pedido);

      return await saveOrder(input, current);
    }
  },

  updateOrderWithStock: async function ({ input, id }) {
    try {
      const { pedido, ...restOfInput } = input;
      const dbOrder = await Pedido.findById(id);
      const isSameProductsNQtyties = isEqual(dbOrder.pedido, pedido);

      if (isSameProductsNQtyties) {
        return await updateOrder(id, restOfInput);
      }

      if (pedido.length === 0) {
        if (dbOrder.pedido.length > 0) {
          await restoreProductsStock(dbOrder.pedido);
          return await updateOrder(id, input);
        }
      }

      if (!isSameProductsNQtyties) {
        const deleteProductsToRestore = dbOrder.pedido.filter((dbProduct) => {
          return !pedido.some((inputProduct) => {
            return dbProduct.id === inputProduct.id;
          });
        });

        const newProductsArr = pedido.filter((inputProduct) => {
          return !dbOrder.pedido.some((storeProduct) => {
            return inputProduct.id === storeProduct.id;
          });
        });

        const storeProductsUpdQtity = pedido.filter((inputProduct) => {
          return dbOrder.pedido.some((storeProduct) => {
            return (
              inputProduct.id === storeProduct.id &&
              inputProduct.cantidad !== storeProduct.cantidad
            );
          });
        });

        if (newProductsArr.length > 0) {
          await checkProductStockFromOrder(newProductsArr);
          await discountProductsStockFromOrder(newProductsArr);
          return await updateOrder(id, input);
        }

        if (storeProductsUpdQtity.length > 0) {
          const dbProductsUpdQtity = dbOrder.pedido.filter((dbProduct) => {
            return storeProductsUpdQtity.some((storeProduct) => {
              return dbProduct.id === storeProduct.id;
            });
          });

          await restoreProductsStock(dbProductsUpdQtity);

          try {
            await checkProductStockFromOrder(storeProductsUpdQtity);
            await discountProductsStockFromOrder(storeProductsUpdQtity);
            return await updateOrder(id, input);
          } catch (error) {
            await discountProductsStockFromOrder(dbProductsUpdQtity);
            throw new Error(
              'Al parecer uno de los productos no cuenta con stock revisa de nuevo.'
            );
          }
        }

        if (deleteProductsToRestore.length > 0) {
          await restoreProductsStock(deleteProductsToRestore);
          return await updateOrder(id, input);
        }
      }
    } catch (error) {
      handleErrorResponse({ errorMsg: error, message: error.message });
    }
  },

  updateOrderWithoutStock: async function (input, id) {
    if (input.pedido) {
      await checkProductStockFromOrder(input.pedido);
    }
    return await updateOrder(id, input);
  },

  updatePaymentOrder: async function (input, id) {
    try {
      const dbOrder = await order({ _id: id });
      dbOrder.fechaPago = getCurrentDateISO();
      await dbOrder.save();
      if (dbOrder.pedido) {
        await checkProductStockFromOrder(dbOrder.pedido);
        await discountProductsStockFromOrder(dbOrder.pedido);
      }
      return await updateOrder(id, input);
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  setAttendOrder: async function (id, current) {
    const dbOrder = await order({ _id: id });

    if (dbOrder.estado === 'PAGADO') {
      dbOrder.atendido = true;
      dbOrder.fechaAtentido = getCurrentDateISO();
      dbOrder.despachador = current.id;
    }

    try {
      await dbOrder.save();
      return dbOrder;
    } catch (error) {
      throw new Error('No se pudo editar el pedido');
    }
  },
  setPackinOrder: async function (id, current) {
    const dbOrder = await order({ _id: id });

    if (dbOrder.estado === 'PAGADO') {
      dbOrder.embalado = true;
      dbOrder.fechaEmbalado = getCurrentDateISO();
      dbOrder.embalador = current.id;
    }

    try {
      await dbOrder.save();
      return dbOrder;
    } catch (error) {
      console.log(error);
      throw new Error('No se pudo editar el pedido');
    }
  },
  setToSendOrder: async function (ids) {
    try {
      await Pedido.updateMany(
        { _id: { $in: ids } },
        { enviado: true, fechaEnvio: getCurrentDateISO() },
        { multi: true, new: true, upsert: false }
      ).exec();
      return 'Pedido editados';
    } catch (error) {
      console.log(error);
      throw new Error('No se pudo editar el pedido');
    }
  },

  removeOrder: async function (id) {
    return await removeOrder(id);
  },

  totalOrdersCount: async function () {
    try {
      return await Pedido.countDocuments();
    } catch (error) {
      throw new Error('❌Error! ❌');
    }
  },

  updateStatusOrder: async function (input, id) {
    const dbOrder = await order({ _id: id });

    if (input.estado === 'ANULADO') {
      dbOrder.fechaAnulado = getCurrentDateISO();
      await dbOrder.save();
      await restoreProductsStock(dbOrder.pedido);
    }

    try {
      return await Pedido.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
