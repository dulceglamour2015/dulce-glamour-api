const { Schema, model } = require('mongoose');

const ProductoSchema = new Schema(
  {
    pedido: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
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
    estado: {
      type: String,
      default: 'PENDIENTE',
    },
    direccion: {
      type: String,
      required: true,
    },
    pago: {
      type: String,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    costEnv: {
      type: Number,
      trim: true,
    },
    descuento: {
      type: Number,
      trim: true,
    },
    creado: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);
module.exports.Pedido = model('Pedido', ProductoSchema);
