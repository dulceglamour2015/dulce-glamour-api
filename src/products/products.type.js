const { gql } = require('apollo-server-express');

module.exports = gql`
  type Producto {
    id: ID!
    nombre: String!
    existencia: Int!
    stockMin: Int
    precio: Float!
    precioCompra: Float!
    categoria: Categoria!
    marca: String!
    undMed: String!
    presentacion: String!
    combo: Boolean
    productosCombo: [ProductsIDs]
    activo: Boolean!
  }

  type ProductsIDs {
    id: String!
    nombre: String!
  }

  input ProductoInput {
    nombre: String
    existencia: Int!
    stockMin: Int!
    precio: Float!
    precioCompra: Float!
    categoria: ID!
    marca: String!
    undMed: String!
    presentacion: String!
  }

  input ComboInput {
    nombre: String
    existencia: Int!
    stockMin: Int!
    precio: Float!
    precioCompra: Float!
    categoria: ID!
    marca: String!
    undMed: String!
    presentacion: String!
    combo: Boolean!
    productosCombo: [ProductsCombo!]!
    activo: Boolean!
  }

  input ProductsCombo {
    id: ID!
    nombre: String!
  }

  input PrevComboProducts {
    productosCombo: [ProductsCombo!]!
    existencia: Int!
  }

  extend type Query {
    # Productos
    allProducts(search: String): [Producto!]!
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    inventoryProducts: [Producto!]! @hasRole(roles: [ADMINISTRADOR]) @auth
    obtenerProducto(id: ID!): Producto!
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
  }

  extend type Mutation {
    # Productos
    nuevoProducto(input: ProductoInput!): Producto!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    nuevoCombo(input: ComboInput!): Producto!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    actualizarProducto(id: ID!, input: ProductoInput): Producto!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    inactivateProduct(id: ID!): Producto! @hasRole(roles: [ADMINISTRADOR]) @auth
    setCombo(id: ID!, input: ComboInput, prev: PrevComboProducts): Producto!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    eliminarProducto(id: ID!): String! @hasRole(roles: [ADMINISTRADOR]) @auth
  }
`;
