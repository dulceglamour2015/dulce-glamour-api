const { gql } = require('apollo-server-express');

module.exports = gql`
  type FormatMoney {
    formatted: String!
    amount: Float!
  }
  input FormatMoneyInput {
    formatted: String!
    amount: Float!
  }

  type EOrder {
    id: ID!
    client: EOrderClient!
    shipping: EOrderShipping!
    lineProducts: [EOrderProducts!]!
    total: FormatMoney!
    status: EOrderStatus!
    description: String
    shippingTotal: String
    discount: String
    paidType: String
    paidDescription: String
    paidImage: String
    createdAt: String!
  }

  type EOrderProducts {
    id: ID!
    quantity: Int!
    price: FormatMoney!
    name: String!
    image: String
    description: String
  }

  type EOrderShipping {
    address: String!
    reference: String!
    city: String!
    province: String!
  }

  type EOrderClient {
    email: String!
    fullName: String!
    phone: String!
    dni: String!
  }

  type EOrderConnection {
    orders: [EOrder!]!
    pageInfo: PageInfo!
  }

  input EOrderInput {
    client: EOrderClientInput!
    shipping: EOrderShippingInput!
    lineProducts: [EOrderProductsInput!]!
    total: Float!
    shippingTotal: String
    discount: String
  }

  input EOrderUpdateInput {
    client: EOrderUpdateClientInput!
    shipping: EOrderShippingInput!
    lineProducts: [EOrderProductsInput!]!
    description: String
    total: Float!
    shippingTotal: String
    discount: String
  }

  input EOrderProductsInput {
    id: ID!
    name: String!
    quantity: Int!
    price: Float!
    image: String!
  }

  input EOrderShippingInput {
    address: String!
    reference: String!
    city: String!
    province: String!
  }

  input EOrderClientInput {
    email: String!
    fullName: String!
    phone: String!
    dni: String!
  }
  input EOrderUpdateClientInput {
    email: String!
    phone: String!
  }

  input EOrderPaidInput {
    order: ID!
    paidType: String!
    paidDescription: String!
    paidImage: String
  }

  enum EOrderStatus {
    PENDING
    PAID
  }

  extend type Query {
    getEOrders(
      status: EOrderStatus
      page: Int
      search: String
    ): EOrderConnection! @hasRole(roles: [ADMINISTRADOR, USUARIO]) @auth
    getEOrder(id: ID!): EOrder!
  }
  extend type Mutation {
    addEOrder(input: EOrderInput!): EOrder!
    updateEOrder(id: ID!, input: EOrderUpdateInput!): EOrder!
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    updateEOrderPaid(input: EOrderPaidInput!): EOrder!
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    deleteEOrder(id: ID!): String! @hasRole(roles: [ADMINISTRADOR]) @auth
  }
`;
