const { gql } = require('apollo-server-core');

module.exports = gql`
  type Box {
    id: ID!
    date: String!
    amount: Float!
    observation: String!
  }

  input BoxInput {
    date: String!
    amount: Float!
    observation: String!
  }

  extend type Query {
    getBox(id: ID!): Box! @hasRole(roles: [ADMINISTRADOR]) @auth
    getAllBox: [Box!]! @hasRole(roles: [ADMINISTRADOR]) @auth
  }

  extend type Mutation {
    createBox(input: BoxInput!): Box! @hasRole(roles: [ADMINISTRADOR]) @auth
    updateBox(id: ID!, input: BoxInput!): Box!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    deleteBox(id: ID): String! @hasRole(roles: [ADMINISTRADOR]) @auth
  }
`;
