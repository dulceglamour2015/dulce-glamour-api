module.exports = `
  type Pedido {
    id: ID
    _id: ID
    pedido: [PedidoGrupo]
    total: Float
    cliente: Cliente
    vendedor: Usuario
    fecha: String
    estado: EstadoPedido
    direccion: String
    pago: TipoPago
    descripcion: String
    costEnv: Float
    descuento: Float
    adicional: Float
    createdAt: String
    descripcionPedido: String
    image: String
    imagePublicId: String
    descripcionAnulado: String
  }

  type PedidoGrupo {
    id: ID
    cantidad: Int
    nombre: String
    precio: Float
    existencia: Int
    marca: String
  }

  type PageInfo {
    totalPages: Int
    totalDocs: Int
    nextPage: Int
  }

  type PedidoConnection {
    pageInfo: PageInfo
    pedidos: [Pedido]
  }

  input PedidoInput {
    cliente: ID
    pedido: [PedidoProductoInput]
    estado: EstadoPedido
    pago: TipoPago
    total: Float
    costEnv: Float
    descuento: Float
    adicional: Float
    direccion: String
    image: String
    imagePublicId: String
    descripcion: String
    descripcionAnulado: String
    descripcionPedido: String
  }

  input PedidoProductoInput {
    id: ID
    cantidad: Int
    nombre: String
    precio: Float
  }

  enum TipoPago {
    BANCO
    EFECTIVO
    MIXTO
  }

  enum EstadoPedido {
    PENDIENTE
    PAGADO
    DESPACHADO
    ANULADO
  }

  input Search {
    seller: String
    client: String
  }

  extend type Query {
    # Pedidos
    obtenerPedidos(page: Int): PedidoConnection
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    paidOrders(page: Int): PedidoConnection @hasRole(roles: [ADMINISTRADOR]) @auth
    obtenerPedido(id: ID!): Pedido @hasRole(roles: [ADMINISTRADOR, USUARIO]) @auth
    totalPedidos: String!
    pedidosPagados(offset: Int): [Pedido]
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    pedidosDespachados(offset: Int): [Pedido]
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    canceledOrders: [Pedido] @hasRole(roles: [ADMINISTRADOR]) @auth
  }

  extend type Mutation {
    # Pedidos
    actualizarPedido(id: ID!, input: PedidoInput, prevOrder: PedidoInput): Pedido
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    updateOrder(id: ID!, input: PedidoInput): Pedido
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    actualizarEstadoPedido(id: ID!, input: PedidoInput): Pedido
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    actualizarPagoPedido(id: ID!, input: PedidoInput!, file: Upload): Pedido
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    eliminarPedido(id: ID!): String @hasRole(roles: [ADMINISTRADOR]) @auth
    nuevoPedido(input: PedidoInput): Pedido
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    generarPdfPed(id: ID!): String @hasRole(roles: [ADMINISTRADOR, USUARIO]) @auth
    searchOrders(search: Search, page: Int): [Pedido]
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
  }
`;
