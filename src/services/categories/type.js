const { gql } = require('apollo-server-express');

module.exports = gql`
  type Categoria {
    id: ID!
    nombre: String!
    ecommerce: Boolean!
    descripcion: String!
    images: [String!]!
  }

  input CategoriaInput {
    nombre: String!
    ecommerce: Boolean!
    descripcion: String!
    images: [String!]!
  }

  type CategorieProducts {
    nombre: String!
    productos: [Producto!]!
  }

  type CategoriesConnection {
    categories: [Categoria!]!
    pageInfo: PageInfo!
  }

  type InventoryCategory {
    name: String!
    countProducts: Int!
    stock: Int!
    vn: Float!
    vf: Float!
  }

  type InventoryCategories {
    inventory: [InventoryCategory!]!
    futureValue: Float!
    netValue: Float!
    totalProducts: Int!
    totalStock: Int!
  }

  extend type Query {
    #Categorias
    getPaginatedCategories(search: String, page: Int): CategoriesConnection!
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    getCategories: [Categoria!]! @hasRole(roles: [ADMINISTRADOR, USUARIO]) @auth
    getCategorie(id: ID!): Categoria!
    getCategoriesWithProducts: InventoryCategories!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    getCategoriesShopping: [Categoria!]!
  }

  extend type Mutation {
    #Categorias
    addCategory(input: CategoriaInput!): Categoria!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    updateCategory(id: ID!, input: CategoriaInput!): Categoria!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    deleteCategory(id: ID!): String! @hasRole(roles: [ADMINISTRADOR]) @auth
    removeImageCategory(id: ID!, image: String!): Categoria!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
  }
`;
