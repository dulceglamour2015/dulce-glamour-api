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

    if (usuario.deleted) {
      throw new AuthenticationError('Permiso denegado.');
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
  reduceQtity: (type) => {
    return (acc, currentValue) => {
      if (!type) {
        return (acc += currentValue.qty);
      } else {
        if (currentValue.tipoVenta === type) {
          acc += 1;
        }
        return acc;
      }
    };
  },

  reduceSale: (type) => {
    return (acc, currentValue) => {
      if (!type) {
        return (acc += currentValue.total);
      } else {
        if (currentValue.tipoVenta === type) {
          acc += currentValue.total;
        }
        return acc;
      }
    };
  },
};
