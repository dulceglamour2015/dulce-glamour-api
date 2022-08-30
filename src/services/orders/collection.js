const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoosePaginateAggregate = require('mongoose-aggregate-paginate-v2');
const mongooseDelete = require('mongoose-delete');

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
    despachador: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
    },
    embalador: {
      type: Schema.Types.ObjectId,
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
    embalado: {
      type: Boolean,
      default: false,
    },
    enviado: {
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
    fechaEmbalado: {
      type: Date,
    },
    fechaEnvio: {
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

PedidoSchema.index({ 'cliente.nombre': 'text' });
PedidoSchema.plugin(mongoosePaginate);
PedidoSchema.plugin(mongoosePaginateAggregate);
PedidoSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
  deletedBy: true,
});

module.exports.Pedido = model('Pedido', PedidoSchema);
