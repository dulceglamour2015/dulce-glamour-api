const { gql } = require('apollo-server-express');

module.exports = gql`
  type Concept {
    id: ID!
    codigo: String!
    descripcion: String!
    name: String!
  }

  input ConceptInput {
    codigo: String!
    descripcion: String!
  }

  type ConceptConnection {
    docs: [Concept!]!
    pageInfo: PageInfo!
  }

  extend type Query {
    allConcepts(search: String, page: Int): ConceptConnection!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    getSelectConcepts: [Concept!]
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
