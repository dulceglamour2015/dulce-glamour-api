const { gql } = require('apollo-server-express');

module.exports = gql`
  type Expense {
    id: ID!
    proveedor: Provider!
    concepto: Concept!
    comprobante: String!
    importe: Float!
    observacion: String!
    comprobanteDate: String!
    registroDate: String!
    usuario: Usuario!
    type: ExpenseType!
  }

  input ExpenseInput {
    proveedor: ID!
    concepto: ID!
    comprobante: String!
    importe: Float!
    observacion: String!
    comprobanteDate: String!
    type: String!
    registroDate: String!
  }

  enum ExpenseType {
    GASTO
    COMPRA
  }

  extend type Query {
    # Gastos
    allExpenses: [Expense!]! @hasRole(roles: [ADMINISTRADOR]) @auth
    getExpense(id: ID!): Expense! @hasRole(roles: [ADMINISTRADOR]) @auth
  }

  extend type Mutation {
    # Gastos
    addExpense(input: ExpenseInput!): Expense!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    updateExpense(id: ID!, input: ExpenseInput): Expense
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    deleteExpense(id: ID!): String @hasRole(roles: [ADMINISTRADOR]) @auth
  }
`;
