const { gql } = require('apollo-server-express');

module.exports = gql`
  type EOrder {
    id: ID!
    client: EOrderClient!
    shipping: EOrderShipping!
    lineProducts: [EOrderProducts!]!
    totalUniqueItems: Int!
    total: String!
    status: String!
  }

  type EOrderProducts {
    id: ID!
    quantity: Int!
    price: String!
    image: String!
    name: String!
    description: String!
  }

  type EOrderShipping {
    address: String!
    reference: String!
    city: String!
  }

  type EOrderClient {
    email: String!
    fullName: String!
    phone: String!
  }

  input EOrderInput {
    client: EOrderClientInput
    shipping: EOrderShippingInput
    lineProducts: [EOrderProductsInput!]!
    totalUniqueItems: Int!
    total: String!
  }

  input EOrderProductsInput {
    id: ID!
    quantity: Int!
    price: String!
    image: String!
    name: String!
    description: String!
  }

  input EOrderShippingInput {
    address: String!
    reference: String!
    city: String!
  }

  input EOrderClientInput {
    email: String!
    fullName: String!
    phone: String!
  }

  extend type Mutation {
    addEOrder(input: EOrderInput!): EOrder
  }
`;
