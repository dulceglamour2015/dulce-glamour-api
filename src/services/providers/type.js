const { gql } = require('apollo-server-express');

module.exports = gql`
  type Provider {
    id: ID!
    ruc: String!
    nombre: String!
    telefono: String!
    direccion: String!
    contacto: String!
    tipo: String!
  }

  type ProviderConnection {
    docs: [Provider!]
    pageInfo: PageInfo!
  }

  input ProviderInput {
    ruc: String!
    nombre: String!
    telefono: String!
    direccion: String!
    contacto: String!
    tipo: String!
  }

  extend type Query {
    #Proveedores
    allProviders(page: Int, search: String): ProviderConnection!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    getSelectProviders: [Provider!]!
    getProvider(id: ID!): Provider @hasRole(roles: [ADMINISTRADOR]) @auth
  }

  extend type Mutation {
    # Proveedores
    addProvider(input: ProviderInput!): Provider
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    updateProvider(id: ID!, input: ProviderInput!): Provider
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    deleteProvider(id: ID!): String @hasRole(roles: [ADMINISTRADOR]) @auth
  }
`;
