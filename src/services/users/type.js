const { gql } = require('apollo-server-express');

module.exports = gql`
  type Usuario {
    id: ID!
    nombre: String!
    username: String!
    rol: RolUsuario!
  }

  input UsuarioInput {
    nombre: String
    username: String
    password: String
    rol: String
  }

  input AutenticarInput {
    username: String!
    password: String!
  }

  type Token {
    token: String!
  }
  enum RolUsuario {
    ADMINISTRADOR
    USUARIO
    SUSPENDIDO
    ALMACEN
  }

  extend type Query {
    #Usuarios
    obtenerUsuario: Usuario
    usuario(id: ID!): Usuario! @hasRole(roles: [ADMINISTRADOR]) @auth
    obtenerUsuarios: [Usuario!]! @hasRole(roles: [ADMINISTRADOR]) @auth
    findOrdersUser(id: ID!): [Pedido!]! @hasRole(roles: [ADMINISTRADOR]) @auth
    findCurrentOrders: [Pedido!]!
      @hasRole(roles: [ADMINISTRADOR, USUARIO, ALMACEN])
      @auth
    findIndicatorToday(id: ID): [Pedido!]!
      @hasRole(roles: [ADMINISTRADOR, USUARIO, ALMACEN])
      @auth
    findProductivityOrdersUsers(date: String): [UserReport!]!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    getLastOrdersUser(userId: ID!): [Pedido!]!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
  }

  extend type Mutation {
    # Usuarios
    nuevoUsuario(id: ID, input: UsuarioInput): Usuario!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    eliminarUsuario(id: ID!): String! @hasRole(roles: [ADMINISTRADOR]) @auth
    actualizarUsuario(id: ID!, input: UsuarioInput): Usuario!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    autenticarUsuario(input: AutenticarInput): Token! @guest
    logout: Boolean @auth
    setPassword(id: ID!, password: String!): String!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
  }
`;
