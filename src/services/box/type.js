const { gql } = require('apollo-server-core');

module.exports = gql`
  type Box {
    id: ID!
    date: String!
    amount: Float!
    observation: String!
  }

  type TreasuryResult {
    id: ID!
    createdAt: String!
    box: Float!
    income: Float!
    expense: Float!
    balance: Float!
    from: String!
    to: String!
  }

  input TreasuryResultInput {
    box: Float!
    income: Float!
    expense: Float!
    balance: Float!
    from: String!
    to: String!
  }

  type Income {
    orders: [Pedido!]!
    boxes: [Box!]!
  }

  type SettlementResult {
    income: Income!
    expenses: [Expense!]!
  }

  input BoxInput {
    date: String!
    amount: Float!
    observation: String!
  }

  input BoxEditInput {
    amount: Float!
    observation: String!
  }

  extend type Query {
    getBox(id: ID!): Box! @hasRole(roles: [ADMINISTRADOR]) @auth
    getAllBox: [Box!]! @hasRole(roles: [ADMINISTRADOR]) @auth
    getTreasuryResults: [TreasuryResult!]!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
  }

  extend type Mutation {
    createBox(input: BoxInput!): Box! @hasRole(roles: [ADMINISTRADOR]) @auth
    createTreasuryResult(input: TreasuryResultInput!): TreasuryResult!
    deleteTreasury(id: ID!): String!

    updateBox(id: ID!, input: BoxEditInput!): Box!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    deleteBox(id: ID): String! @hasRole(roles: [ADMINISTRADOR]) @auth
    getSettlement(to: String!, from: String!): SettlementResult
      @hasRole(roles: [ADMINISTRADOR])
      @auth
  }
`;
