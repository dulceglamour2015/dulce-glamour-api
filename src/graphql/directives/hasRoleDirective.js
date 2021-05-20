const {
  SchemaDirectiveVisitor,
  AuthenticationError,
} = require('apollo-server-express');
const {
  defaultFieldResolver,
  GraphQLDirective,
  DirectiveLocation,
  GraphQLList,
} = require('graphql');

class HasRoleDirective extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration(directiveName, schema) {
    return new GraphQLDirective({
      name: 'hasRole',
      locations: [DirectiveLocation.FIELD_DEFINITION],
      args: {
        roles: {
          type: new GraphQLList(schema.getType('RolUsuario')),
        },
      },
    });
  }

  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const roles = this.args.roles;
    field.resolve = async function (...args) {
      const context = args[2];
      const { current } = context;
      const rolUsuario = current.rol;

      if (roles.some((rol) => rolUsuario.indexOf(rol) !== -1)) {
        const result = await resolve.apply(this, args);
        return result;
      }

      throw new AuthenticationError('No estas autorizado para esta accion');
    };
  }
}

module.exports = HasRoleDirective;
