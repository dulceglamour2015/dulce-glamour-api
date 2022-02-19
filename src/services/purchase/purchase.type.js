const { gql } = require('apollo-server-express');

module.exports = gql`
  type Purchase {
    id: ID
    proveedor: Provider
    factura: String
    productos: [PurchaseProducts]
    createdAt: String
  }

  type PurchaseProducts {
    id: ID
    nombre: String
    cantidad: Int
    costCompra: Float
  }

  input PurchaseInput {
    id: ID
    proveedor: ID
    factura: String
    productos: [PurchaseProductsInput]
  }

  input PurchaseProductsInput {
    id: ID
    nombre: String
    cantidad: Int
    costCompra: Float
  }

  type Query {
    getAllPurchases: [Purchase] @hasRole(roles: [ADMINISTRADOR]) @auth
    getPurchase(id: ID!): Purchase @hasRole(roles: [ADMINISTRADOR]) @auth
  }

  type Mutation {
    addPurchase(input: PurchaseInput): Purchase
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    updatePurchase(id: ID!, input: PurchaseInput): Purchase
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    deletePurchase(id: ID!): String @hasRole(roles: [ADMINISTRADOR]) @auth
  }
`;
