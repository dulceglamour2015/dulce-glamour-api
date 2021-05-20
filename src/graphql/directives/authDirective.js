const { asegurarInicio } = require('../../utils/auth');
const { SchemaDirectiveVisitor } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async function (...args) {
      const context = args[2];
      asegurarInicio(context.req);
      return resolve.apply(this, args);
    };
  }
}

module.exports = AuthDirective;
