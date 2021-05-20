const { SchemaDirectiveVisitor } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');
const { asegurarCierre } = require('../../utils/auth');

class GuestDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = function (...args) {
      const context = args[2];
      asegurarCierre(context.req);

      return resolve.apply(this, args);
    };
  }
}

module.exports = GuestDirective;
