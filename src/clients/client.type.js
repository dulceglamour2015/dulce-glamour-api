module.exports = `
  type Cliente {
    id: ID
    cedula: String
    nombre: String
    mail: String
    telefono: Int
    direccion: String
    estado: Boolean
    provincia: District
  }

  type District {
    _id: ID
    nombre: String
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
    obtenerClientes(offset: Int): [Cliente]
    obtenerClientesVendedor: [Cliente]
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    obtenerCliente(id: ID!): Cliente
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    getDistricts: [District]
    getLast20Orders(clientId: ID!): [Pedido]
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
  }

  extend type Mutation {
    # Clientes
    nuevoCliente(input: ClienteInput): Cliente
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    actualizarCliente(id: ID!, input: ClienteInput): Cliente
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    eliminarCliente(id: ID!): String @hasRole(roles: [ADMINISTRADOR]) @auth
  }
`;