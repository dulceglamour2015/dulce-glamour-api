module.exports = `
  type Producto {
    id: ID
    nombre: String
    existencia: Int
    stockMin: Int
    precio: Float
    precioCompra: Float
    creado: String
    categoria: Categoria
    marca: String
    undMed: String
    presentacion: String
    combo: Boolean
    productosCombo: [ProductsIDs]
  }

  type ProductsIDs {
    id: String
    nombre: String
  }

  input ProductoInput {
    nombre: String
    existencia: Int
    stockMin: Int
    precio: Float
    categoria: ID
    marca: String
    undMed: String
    presentacion: String
    combo: Boolean
    productosCombo: [ComboInput]
  }

  input ComboInput {
    id: ID
    nombre: String
  }

  extend type Query {
    # Productos
    allProducts(page: Int, limit: Int): [Producto]
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    obtenerProducto(id: ID!): Producto
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
  }

  extend type Mutation {
    # Productos
    nuevoProducto(input: ProductoInput!): Producto
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    nuevoCombo(input: ProductoInput!): Producto
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    actualizarProducto(id: ID!, input: ProductoInput): Producto
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    setCombo(id: ID!, input: ProductoInput, prev: ProductoInput): Producto
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    eliminarProducto(id: ID!): String @hasRole(roles: [ADMINISTRADOR]) @auth
  }
`;
