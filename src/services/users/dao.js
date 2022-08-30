'use strict';
const { Usuario } = require('./collection');
const { Pedido } = require('../orders/collection');

const { loaderFactory } = require('../../utils/loaderFactory');
const { findAllOrders } = require('../orders/lib');
const { getMongooseSelectionFromReq } = require('../../utils/selectFields');
const {
  filterOrdersByCurrentDay,
  getFilterDate,
  authenticate,
  createToken,
  getPaginatedUsers,
} = require('./lib');
const { hashPassword } = require('../../utils/hashed');
const { handleErrorResponse } = require('../../utils/graphqlErrorRes');
const { DateTime } = require('luxon');
const { getDateToQuery } = require('../stadistics/lib');
const { getPaginateOptions } = require('../../config');

module.exports = {
  getUsers: async ({ search, page }) => {
    const options = getPaginateOptions({
      page,
      limit: 10,
      sort: { nombre: 1 },
    });
    try {
      if (search) {
        const searchOptions = getPaginateOptions({
          page,
          limit: 10,
          sort: { score: { $meta: 'textScore' } },
          projection: { score: { $meta: 'textScore' } },
        });

        return getPaginatedUsers({
          query: {
            $text: { $search: search },
          },
          options: searchOptions,
        });
      }

      return await getPaginatedUsers({ options });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
  getUser: async (id) => {
    try {
      const user = await Usuario.findById(id);

      return user;
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
  getLastOrdersUser: async (userId) => {
    try {
      return await Pedido.find({ vendedor: userId, estado: 'PAGADO' })
        .limit(50)
        .sort({ _id: -1 });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  // Start Dashboard Queries
  getCurrentUserOrders: async (current, info) => {
    const fields = getMongooseSelectionFromReq(info);
    delete fields.__typename;

    try {
      const orders = await Pedido.find(
        {
          estado: 'PAGADO',
          vendedor: current.id,
          createdAt: { $gte: new Date('2021-05-01') },
        },
        fields,
        { sort: { createdAt: 1 } }
      );

      return filterOrdersByCurrentDay(orders);
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  getProductivityUser: async function ({ id, current }) {
    const { year, month, day } = getDateToQuery();
    const currentDate = DateTime.fromObject({
      year,
      month,
      day,
      hour: 0,
      minute: 0,
      millisecond: 0,
    })
      .setZone('America/Lima')
      .toJSDate();

    try {
      const orders = await Pedido.find(
        {
          estado: 'PAGADO',
          vendedor: id ? id : current.id,
          fechaPago: { $gte: new Date(currentDate) },
        },
        'createdAt fechaPago total',
        { sort: { createdAt: 1 } }
      );

      return orders;
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },
  // End Dashboard Queries

  //TODO: Refactor this function!
  getProductivityUsersOrders: async function (date) {
    let dateFilterStart = getFilterDate(0, 0, 0, 0, date);
    let dateFilterFinal = getFilterDate(23, 59, 59, 999, date);
    let dateStart = new Date(dateFilterStart);
    let dateFinal = new Date(dateFilterFinal);
    let queryDate = date
      ? {
          $gte: dateStart,
          $lte: dateFinal,
        }
      : { $gte: dateStart };

    const aggregate = [
      {
        $lookup: {
          from: 'pedidos',
          localField: '_id',
          foreignField: 'vendedor',
          as: 'userOrders',
        },
      },
      { $unwind: '$userOrders' },
      {
        $match: {
          'userOrders.estado': 'PAGADO',
          'userOrders.fechaPago': queryDate,
        },
      },
      {
        $group: {
          _id: '$_id',
          root: { $mergeObjects: '$$ROOT' },
          orders: { $push: '$userOrders' },
        },
      },
    ];

    try {
      const res = await Usuario.aggregate(aggregate);

      return res.map((response) => {
        return { usuario: response.root.nombre, pedidos: response.orders };
      });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  loaderUsersOrder: async function (parent, loader) {
    try {
      return await loaderFactory(loader, Usuario, parent);
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  login: async (input) => {
    const { username, password } = input;
    const usuario = await authenticate({ username, password });

    return createToken(usuario);
  },
  addUser: async function (input) {
    const exist = await Usuario.findOne({ username: input.username });
    if (exist) {
      throw new Error('Error el usuario ya existe!');
    }
    try {
      const hash = await hashPassword(input.password);
      return await Usuario.create({
        nombre: input.nombre,
        username: input.username,
        rol: input.rol,
        password: hash,
      });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  suspendUser: async function (id, current) {
    try {
      const [handleDelete, user] = await Promise.all([
        Usuario.deleteById(id, current.id),
        Usuario.findById(id),
      ]);

      return user;
    } catch (error) {
      handleErrorResponse({ errorMsg: error, message: 'BAD_REQUEST' });
    }
  },

  activateUser: async (id) => {
    try {
      const user = await Usuario.findById(id);

      await user.restore();

      return user;
    } catch (error) {
      handleErrorResponse({ errorMsg: error, message: 'BAD_REQUEST' });
    }
  },

  updateUser: async function (id, input) {
    if (input.username) {
      const exist = await Usuario.findOne({ username: input.username });
      if (exist) throw new Error('Intenta con otro nombre');
    }

    try {
      return await Usuario.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
    } catch (error) {
      handleErrorResponse({ errorMsg: error });
    }
  },

  // Mutation to set password
  updatePassword: async function (id, password) {
    try {
      const hash = await hashPassword(password);
      if (hash) {
        await Usuario.findByIdAndUpdate(id, { password: hash }, { new: true });

        return 'Contraseña actualizada';
      }
    } catch (error) {
      handleErrorResponse({ errorMsg: error, message: 'BAD_REQUEST' });
    }
  },
};
