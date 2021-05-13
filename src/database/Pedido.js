const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const PedidoSchema = new Schema(
  {
    pedido: {
      type: Array,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    cliente: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Cliente'
    },
    vendedor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Usuario'
    },
    estado: {
      type: String,
      default: 'PENDIENTE'
    },
    direccion: {
      type: String,
      required: true
    },
    pago: {
      type: String,
      trim: true
    },
    descripcion: {
      type: String,
      trim: true
    },
    costEnv: {
      type: Number,
      trim: true
    },
    descuento: {
      type: Number,
      trim: true
    },
    adicional: {
      type: Number,
      trim: true
    },
    creado: {
      type: Date,
      default: new Date()
    },
    descripcionPedido: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    imagePublicId: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

PedidoSchema.plugin(mongoosePaginate);
module.exports.Pedido = model('Pedido', PedidoSchema);
