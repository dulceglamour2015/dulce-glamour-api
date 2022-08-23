const { Usuario } = require('./collection');
const { DateTime } = require('luxon');
const { AuthenticationError } = require('apollo-server-express');
const _ = require('lodash');
const { sign } = require('jsonwebtoken');

const { getFullDateInNumber } = require('../../utils/formatDate');
const { getDateToQuery } = require('../stadistics/lib');

module.exports = {
  authenticate: async ({ username, password }) => {
    const usuario = await Usuario.findOne({ username });
    if (!usuario) {
      throw new AuthenticationError(
        'Credenciales Incorrectas, Intetalo de nuevo.'
      );
    }

    try {
      await usuario.comparePassword(password);
    } catch (error) {
      throw new AuthenticationError(
        'Credenciales Incorrectas, Intetalo de nuevo.'
      );
    }
    return usuario;
  },
  createToken: async (user) => {
    const EXPIRES_IN = '1d';
    const payload = _.pick(user, ['id', 'nombre', 'username', 'rol']);

    return sign(payload, process.env.JWT_SECRET, { expiresIn: EXPIRES_IN });
  },
  findUserByFilter: async function (filter) {
    try {
      return await Usuario.findOne(filter);
    } catch (error) {
      throw new Error('No se pudo encontrar el usuario');
    }
  },
  filterOrdersByCurrentDay: (orders) => {
    const { year, month, day } = getFullDateInNumber();
    return orders.filter((order) => {
      const formatDate = DateTime.fromJSDate(order.fechaPago, {
        zone: 'America/Guayaquil',
      });

      return (
        formatDate.year === year &&
        formatDate.month === month &&
        formatDate.day === day
      );
    });
  },
  getFilterDate: (h, m, s, ms, queryDate) => {
    const dateToQuery = getDateToQuery(queryDate);
    const date = DateTime.fromObject({
      ...dateToQuery,
      hour: h,
      minute: m,
      second: s,
      millisecond: ms,
    })
      .setZone('America/Lima')
      .toJSDate();
    return date;
  },
  isAdmin: (user) => user && user.rol === 'ADMINISTRADOR',

  getPaginatedUsers: async ({ query = {}, options }) => {
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
    } = await Usuario.paginate(query, options);

    return {
      users: docs,
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
