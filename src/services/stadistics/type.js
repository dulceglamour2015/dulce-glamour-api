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

  type OrdersReportResponse {
    total: Float!
    qtityOrders: Int!
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
    onlineResponse: OrdersReportResponse!
    directResponse: OrdersReportResponse!
    withoutMethodResponse: OrdersReportResponse!
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
  }
`;
