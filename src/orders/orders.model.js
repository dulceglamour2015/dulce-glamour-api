const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const PedidoSchema = new Schema(
  {
    // Relaciones
    cliente: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Cliente',
    },
    vendedor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Usuario',
    },
    // Estado del Pedido
    estado: {
      type: String,
      default: 'PENDIENTE',
    },
    pago: {
      type: String,
      trim: true,
    },
    tipoVenta: {
      type: String,
      trim: true,
    },
    atendido: {
      type: Boolean,
      default: false,
    },
    // Pedido
    pedido: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    costEnv: {
      type: Number,
      trim: true,
    },
    descuento: {
      type: Number,
      trim: true,
    },
    adicional: {
      type: Number,
      trim: true,
    },
    // Fechas
    fechaPago: {
      type: Date,
    },
    fechaCreado: {
      type: Date,
    },
    fechaAnulado: {
      type: Date,
    },
    fechaAtentido: {
      type: Date,
    },
    // Imagen de Pago(Boucher)
    image: {
      type: String,
      trim: true,
    },
    imagePublicId: {
      type: String,
      trim: true,
    },
    // Descripciones
    // Descripcion de Pago
    descripcion: {
      type: String,
      trim: true,
    },
    descripcionPedido: {
      type: String,
      trim: true,
    },
    descripcionAnulado: {
      type: String,
      trim: true,
    },
    direccion: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// PedidoSchema.index(
//   { createdAt: 1 },
//   {
//     expires: '1d',
//     partialFilterExpression: {
//       createdAt: { $gt: new Date(2021, 4, 30, 23, 59, 59, 999) },
//       estado: 'PENDIENTE',
//     },
//   }
// );

PedidoSchema.plugin(mongoosePaginate);
module.exports.Pedido = model('Pedido', PedidoSchema);
