module.exports = `
  type Concept {
    id: ID
    codigo: Int
    descripcion: String
  }

  input ConceptInput {
    codigo: Int!
    descripcion: String!
  }

  extend type Query {
    #Clientes
    allConcepts: [Concept] @hasRole(roles: [ADMINISTRADOR]) @auth
    getConcept(id: ID!): Concept @hasRole(roles: [ADMINISTRADOR]) @auth
  }

  extend type Mutation {
    # Clientes
    addConcept(input: ConceptInput!): Concept
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    updateConcept(id: ID!, input: ConceptInput!): Concept
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    deleteConcept(id: ID!): String @hasRole(roles: [ADMINISTRADOR]) @auth
  }
`;
