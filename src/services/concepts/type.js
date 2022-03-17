const { gql } = require('apollo-server-express');

module.exports = gql`
  type Concept {
    id: ID!
    codigo: String!
    descripcion: String!
  }

  input ConceptInput {
    codigo: String!
    descripcion: String!
  }

  extend type Query {
    allConcepts: [Concept!]! @hasRole(roles: [ADMINISTRADOR]) @auth
    getConcept(id: ID!): Concept @hasRole(roles: [ADMINISTRADOR]) @auth
  }

  extend type Mutation {
    addConcept(input: ConceptInput!): Concept
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    updateConcept(id: ID!, input: ConceptInput!): Concept
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    deleteConcept(id: ID!): String @hasRole(roles: [ADMINISTRADOR]) @auth
  }
`;