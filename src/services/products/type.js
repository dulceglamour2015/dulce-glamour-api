const { gql } = require('apollo-server-express');

module.exports = gql`
  type Producto {
    id: ID!
    nombre: String!
    existencia: Int!
    stockMin: Int
    precio: Float!
    precioCompra: Float!
    precioUnd: Float!
    precioOferta: Float
    oferta: Boolean
    ecommerce: Boolean
    categoria: Categoria!
    marca: String!
    undMed: String!
    presentacion: String!
    combo: Boolean
    productosCombo: [ProductsIDs]
    images: [String!]!
    descripcion: String!
  }

  type InventoryProduct {
    nombre: String!
    stock: Int!
    pv: Float!
    pc: Float!
    vn: Float!
    vf: Float!
  }

  type InventoryProducts {
    inventory: [InventoryProduct!]!
    neto: Float!
    futuro: Float!
    totalProducts: Float!
  }

  type ProductsIDs {
    id: String!
    nombre: String!
  }

  type ProductoConection {
    pageInfo: PageInfo!
    productos: [Producto!]!
  }

  input ProductoInput {
    nombre: String!
    existencia: Int!
    stockMin: Int!
    precio: Float!
    precioCompra: Float!
    precioUnd: Float!
    precioOferta: Float!
    oferta: Boolean!
    ecommerce: Boolean!
    categoria: ID!
    marca: String!
    undMed: String!
    presentacion: String!
    images: [String!]!
    descripcion: String!
    combo: Boolean!
    productosCombo: [ProductsCombo!]!
  }

  input ComboInput {
    nombre: String
    existencia: Int!
    stockMin: Int!
    precio: Float!
    precioCompra: Float!
    precioUnd: Float!
    categoria: ID!
    marca: String!
    undMed: String!
    presentacion: String!
    combo: Boolean!
    productosCombo: [ProductsCombo!]!
    descripcion: String!
  }

  input ProductsCombo {
    id: ID!
    nombre: String!
  }

  input PrevComboProducts {
    productosCombo: [ProductsCombo!]!
    existencia: Int!
  }

  input ShoppingProductsFilterInput {
    slug: String
    where: String
    sort: String
    oferta: Boolean
    limit: Int
    search: String
    page: Int
  }

  extend type Query {
    # Productos
    getPaginatedProducts(search: String, page: Int): ProductoConection!
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    getDeletedProducts(search: String, page: Int): ProductoConection!
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    inventoryProducts: InventoryProducts! @hasRole(roles: [ADMINISTRADOR]) @auth
    selectProducts: [Producto!]! @hasRole(roles: [ADMINISTRADOR, USUARIO]) @auth
    getProduct(id: ID!): Producto!
    shoppingProducts(input: ShoppingProductsFilterInput): ProductoConection!
    getOffersProducts: [Producto!]!
    getLatestProducts: [Producto!]!
    getRelatedProducts(categoryId: ID!, productId: ID!): [Producto!]!
    getShoppingProductsSearch(search: String): [Producto!]!
  }

  extend type Mutation {
    # Productos
    addProduct(input: ProductoInput!): Producto!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    nuevoCombo(input: ComboInput!): Producto!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    updateProduct(id: ID!, input: ProductoInput): Producto!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    inactivateProduct(id: ID!): Producto! @hasRole(roles: [ADMINISTRADOR]) @auth
    setCombo(id: ID!, input: ComboInput, prev: PrevComboProducts): Producto!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    deleteProduct(id: ID!): String! @hasRole(roles: [ADMINISTRADOR]) @auth
    removeImage(id: ID!, image: String!): Producto!
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    reactivateProduct(id: ID!): Producto! @hasRole(roles: [ADMINISTRADOR]) @auth
  }
`;
