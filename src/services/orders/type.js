const { gql } = require('apollo-server-express');

module.exports = gql`
  type Pedido {
    id: ID!
    _id: ID!
    cliente: Cliente!
    vendedor: Usuario!
    pedido: [PedidoGrupo!]!
    costEnv: Float
    descuento: Float
    adicional: Float
    total: Float!
    estado: EstadoPedido!
    atendido: Boolean
    embalado: Boolean
    enviado: Boolean
    pago: TipoPago
    tipoVenta: TipoVenta
    image: String
    imagePublicId: String
    direccion: String!
    descripcion: String
    descripcionPedido: String
    descripcionAnulado: String
    createdAt: String!
    fechaPago: String
  }

  type PedidoGrupo {
    id: ID!
    cantidad: Int!
    nombre: String!
    precio: Float!
  }

  type PedidoConnection {
    pageInfo: PageInfo!
    pedidos: [Pedido!]!
  }

  input PedidoInput {
    cliente: ID
    pedido: [PedidoProductoInput]
    estado: String
    pago: String
    tipoVenta: String
    total: Float
    costEnv: Float
    descuento: Float
    adicional: Float
    image: String
    imagePublicId: String
    direccion: String
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

  enum TipoVenta {
    DIRECTA
    ENLINEA
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

  input OrderInputFilter {
    id: ID
    name: String
  }

  extend type Query {
    # Pedidos
    getOrders(
      page: Int
      type: String
      status: String
      filters: OrderInputFilter
    ): PedidoConnection! @hasRole(roles: [ADMINISTRADOR, USUARIO]) @auth
    ordersToAttend(page: Int): PedidoConnection
      @hasRole(roles: [ADMINISTRADOR, ALMACEN])
      @auth
    ordersToPackIn(page: Int): PedidoConnection
      @hasRole(roles: [ADMINISTRADOR, ALMACEN])
      @auth
    ordersToSend(page: Int): PedidoConnection
      @hasRole(roles: [ADMINISTRADOR, ALMACEN])
      @auth
    ordersDispatched(page: Int): PedidoConnection
      @hasRole(roles: [ADMINISTRADOR, ALMACEN])
      @auth
    canceledOrders: [Pedido] @hasRole(roles: [ADMINISTRADOR]) @auth
    obtenerPedido(id: ID!): Pedido
      @hasRole(roles: [ADMINISTRADOR, USUARIO, ALMACEN])
      @auth
    searchOrders(search: Search, page: Int): [Pedido]
      @hasRole(roles: [ADMINISTRADOR])
      @auth
  }

  extend type Mutation {
    # Pedidos
    # Mutaciones de creacion
    createOrder(input: PedidoInput): Pedido
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    # Mutaciones de actualizaciones
    updateOrderWithStock(id: ID!, input: PedidoInput): Pedido
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    updateOrderWithoutStock(id: ID!, input: PedidoInput): Pedido
      @hasRole(roles: [ADMINISTRADOR])
      @auth
    updateStatusOrder(id: ID!, input: PedidoInput): Pedido
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    #Mutaciones de Almacen
    updatePaymentOrder(id: ID!, input: PedidoInput!, file: Upload): Pedido
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
    updateAttendOrder(id: ID!): Pedido
      @hasRole(roles: [ADMINISTRADOR, ALMACEN])
      @auth
    updatePackinOrder(id: ID!): Pedido
      @hasRole(roles: [ADMINISTRADOR, ALMACEN])
      @auth
    updateSendOrder(id: [ID!]!): String
      @hasRole(roles: [ADMINISTRADOR, ALMACEN])
      @auth
    #Mutaciones de eliminar
    removeOrder(id: ID!): String @hasRole(roles: [ADMINISTRADOR]) @auth
    #Mutaciones de busqueda
    generarPdfPed(id: ID!): String
      @hasRole(roles: [ADMINISTRADOR, USUARIO])
      @auth
  }
`;
