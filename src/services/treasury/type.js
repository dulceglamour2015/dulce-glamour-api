const { gql } = require('apollo-server-core');

module.exports = gql`
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

  extend type Query {
    getTreasuryResults: [TreasuryResult!]!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
  }

  extend type Mutation {
    createTreasuryResult(input: TreasuryResultInput!): TreasuryResult!
    deleteTreasury(id: ID!): String!
  }
`;
