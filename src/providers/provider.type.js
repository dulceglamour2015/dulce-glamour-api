module.exports = `
  type Provider {
    id: ID
    ruc: String
    nombre: String
    telefono: String
    direccion: String
    contacto: String
  }

  input ProviderInput {
    ruc: String!
    nombre: String!
    telefono: String!
    direccion: String!
    contacto: String!
  }

  extend type Query {
    #Proveedores
    allProviders: [Provider] @hasRole(roles: [ADMINISTRADOR]) @auth
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