const { gql } = require('apollo-server-express');

module.exports = gql`
  type TopCliente {
    total: Float!
    cantPedido: Int!
    cliente: Cliente!
  }

  type TopVendedor {
    total: Float!
    cantPedido: Int!
    vendedor: Usuario!
  }

  type OrdersOnlineSellersResponse {
    total: Float!
    qtityOrders: Int!
  }
  type OrdersDirectSellersResponse {
    total: Float!
    qtityOrders: Int!
  }
  type OrdersWithoutPaidMethodSellersResponse {
    total: Float!
    qtityOrders: Int!
  }

  type BestSellerResponse {
    ordersSellers: [TopVendedor!]!
    onlineResponse: OrdersOnlineSellersResponse!
    directResponse: OrdersDirectSellersResponse!
    withoutMethodResponse: OrdersWithoutPaidMethodSellersResponse!
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
    usuario: String!
    pedidos: [Pedido!]!
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
    from: String
    to: String
  }

  extend type Query {
    # Busquedas Avanzadas
    mejoresClientes(filter: DateFilter): [TopCliente!]!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    mejoresVendedores(filter: DateFilter): BestSellerResponse!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    productivityUser(
      id: ID
      withOutId: Boolean!
      date: String
    ): UsersProductiviy @hasRole(roles: [ADMINISTRADOR, USUARIO]) @auth
  }

  extend type Mutation {
    totalDeVentas(day: Int, month: Int, year: Int): VentasTotal
  }
`;
