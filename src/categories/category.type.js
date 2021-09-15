const { gql } = require('apollo-server-express');

module.exports = gql`
  type Categoria {
    id: ID!
    nombre: String!
  }

  input CategoriaInput {
    nombre: String!
  }

  type CategorieProducts {
    nombre: String!
    productos: [Producto!]!
  }

  extend type Query {
    #Categorias
    obtenerCategorias: [Categoria]!
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    obtenerCategoria(id: ID!): Categoria!
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    getCategoriesWithProducts: [CategorieProducts!]!
    getCategoriesShopping: [Categoria!]!
  }

  extend type Mutation {
    #Categorias
    nuevaCategoria(input: CategoriaInput!): Categoria!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    actualizarCategoria(id: ID!, input: CategoriaInput!): Categoria!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    eliminarCategoria(id: ID!): String! @hasRole(roles: [ADMINISTRADOR]) @auth
  }
`;
