module.exports = `
  type TopCliente {
    total: Float
    cantPedido: Int
    cliente: Cliente
  }

  type TopVendedor {
    total: Float
    cantPedido: Int
    vendedor: Usuario
  }

  type VentasTotal {
    total: Float
    pedidos: [Pedido]
  }

  type UsersProductiviy {
    total: Float
    count: Int
  }

  type UserReport {
    usuario: String
    pedidos: [Pedido]
  }

  input From {
    day: Int
    month: Int
    year: Int
  }

  input To {
    day: Int
    month: Int
    year: Int
  }

  input DateFilter {
    from: From
    to: To
  }

  extend type Query {
    # Busquedas Avanzadas
    mejoresClientes(filter: DateFilter): [TopCliente]
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    mejoresVendedores(filter: DateFilter): [TopVendedor]
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    productivityUser(id: ID, withOutId: Boolean!): UsersProductiviy
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    findUserOrders: [UserReport]
      @hasRole(roles: [ADMINISTRADOR])
      @auth
  }

  extend type Mutation {
    totalDeVentas(day: Int, month: Int, year: Int): VentasTotal
  }
`;
