const { gql } = require('apollo-server-express');

module.exports = gql`
  type Cliente {
    id: ID!
    cedula: String!
    nombre: String!
    mail: String!
    telefono: Int!
    direccion: String
    provincia: District
    estado: Boolean!
  }

  type District {
    _id: ID!
    nombre: String!
  }

  type ClientConnection {
    clients: [Cliente!]!
    pageInfo: PageInfo!
  }

  input ClienteInput {
    cedula: String!
    nombre: String
    mail: String!
    telefono: Int!
    direccion: String
    estado: Boolean
    provincia: ID
  }

  extend type Query {
    #Clientes
    getPaginatedClients(search: String, page: Int): ClientConnection!
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    getClients(search: String): [Cliente!]!
    obtenerClientesVendedor: [Cliente!]!
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    getClient(id: ID!): Cliente! @hasRole(roles: [ADMINISTRADOR, USUARIO]) @auth
    getClientByDNI(dni: String!): Cliente!
    getDistricts: [District!]!
    getLastOrdersClient(clientId: ID!): [Pedido!]!
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
  }

  extend type Mutation {
    # Clientes
    nuevoCliente(input: ClienteInput!): Cliente!
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    actualizarCliente(id: ID!, input: ClienteInput!): Cliente!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    eliminarCliente(id: ID!): String @hasRole(roles: [ADMINISTRADOR]) @auth
  }
`;
