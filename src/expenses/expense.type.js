module.exports = `
  type Expense {
    id: ID
    proveedor: Provider
    concepto: Concept
    comprobante: String
    importe: Float
    observacion: String
    comprobanteDate: String
    usuario: Usuario
  }

  input ExpenseInput {
    proveedor: ID!
    concepto: ID!
    comprobante: String!
    importe: Float!
    observacion: String!
    comprobanteDate: String!
  }

  extend type Query {
    # Gastos
    allExpenses: [Expense] @hasRole(roles: [ADMINISTRADOR]) @auth
    getExpense(id: ID!): Expense @hasRole(roles: [ADMINISTRADOR]) @auth
  }

  extend type Mutation {
    # Gastos
    addExpense(input: ExpenseInput): Expense
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    updateExpense(id: ID!, input: ExpenseInput): Expense
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    deleteExpense(id: ID!): String @hasRole(roles: [ADMINISTRADOR]) @auth
  }
`;
