const { gql } = require('apollo-server-express');

module.exports = gql`
  type Categoria {
    id: ID!
    nombre: String!
    descripcion: String!
    images: [String!]!
  }

  input CategoriaInput {
    nombre: String!
    descripcion: String!
    images: [String!]!
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
      @hasRole(roles: [ADMINISTRADOR])
      @auth
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
    removeImageCategory(id: ID!, image: String!): Categoria!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
  }
`;
