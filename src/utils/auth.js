const { Usuario } = require('../users/users.model');
const { AuthenticationError } = require('apollo-server-express');
const _ = require('lodash');
const { sign, verify, decode } = require('jsonwebtoken');

const enLinea = (req) => req.headers['authorization'];
const { JWT_SECRET } = process.env;

module.exports.iniciarSesion = async ({ username, password }) => {
  const usuario = await Usuario.findOne({ username });
  if (!usuario) {
    throw new AuthenticationError(
      'Credenciales Incorrectas, Intetalo de nuevo.'
    );
  }
  await usuario.comparePassword(password);
  return usuario;
};

module.exports.asegurarInicio = (req) => {
  if (!enLinea(req)) {
    throw new AuthenticationError('Debes iniciar sesion');
  }
  return true;
};

module.exports.asegurarCierre = (req) => {
  if (enLinea(req)) {
    throw new AuthenticationError('Aun estas logueado');
  }
  return true;
};

module.exports.authContext = async (authorization) => {
  let token = '';
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.split(' ')[1];
  }

  return verify(token, JWT_SECRET, (error, decode) => {
    if (error) {
      throw new AuthenticationError('Necesitas iniciar sesión');
    }

    if (decode) {
      return decode;
    }
  });
};

module.exports.createToken = async (user) => {
  const EXPIRES_IN = '1d';
  const payload = _.pick(user, ['id', 'nombre', 'username', 'rol']);

  return sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
};
