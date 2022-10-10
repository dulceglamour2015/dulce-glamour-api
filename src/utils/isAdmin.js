const { USER_ROLES } = require('../enums');

function isAdmin(user) {
  return user && user.rol === USER_ROLES.ADMIN;
}

module.exports = { isAdmin };
