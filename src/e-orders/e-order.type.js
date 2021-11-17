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
    totalUniqueItems: Int!
    total: FormatMoney!
    status: String!
    shippingTotal: String
    discount: String
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

  input EOrderInput {
    client: EOrderClientInput!
    shipping: EOrderShippingInput!
    lineProducts: [EOrderProductsInput!]!
    totalUniqueItems: Int
    total: FormatMoneyInput!
    shippingTotal: String
    discount: String
  }

  input EOrderProductsInput {
    id: ID!
    quantity: Int!
    price: FormatMoneyInput!
    name: String!
    image: String
    description: String
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

  extend type Query {
    allEOrder(status: String): [EOrder!]!
    getEOrder(id: ID!): EOrder!
  }
  extend type Mutation {
    addEOrder(input: EOrderInput!): EOrder!
    updateEOrder(
      id: ID!
      input: EOrderInput!
      prevEOrder: [EOrderProductsInput]
    ): EOrder!
  }
`;
