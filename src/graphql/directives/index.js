const AuthDirective = require('./authDirective');
const HasRoleDirective = require('./hasRoleDirective');
const GuestDirective = require('./noAuthDirective');

module.exports = {
  auth: AuthDirective,
  hasRole: HasRoleDirective,
  guest: GuestDirective,
};
