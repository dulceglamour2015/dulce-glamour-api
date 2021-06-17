const { Usuario } = require('./users.model');

async function findUserByFilter(filter) {
  try {
    return await Usuario.findOne(filter);
  } catch (error) {
    throw new Error('No se pudo encontrar el usuario');
  }
}

module.exports = {
  findUserByFilter,
};
