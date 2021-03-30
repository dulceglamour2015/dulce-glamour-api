const { Schema, model } = require('mongoose');

const ProductsSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    existencia: {
      type: Number,
      required: true,
      trim: true
    },
    precio: {
      type: Number,
      required: true,
      trim: true
    },
    marca: {
      type: String,
      required: true,
      trim: true
    },
    undMed: {
      type: String,
      required: true,
      trim: true
    },
    presentacion: {
      type: String,
      required: true,
      trim: true
    },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: 'Categoria',
      required: true,
      trim: true
    },
    combo: {
      type: Boolean,
      trim: true
    },
    productosCombo: {
      type: Array,
      trim: true
    },
    creado: {
      type: Date,
      default: Date.now()
    }
  },
  { timestamps: true }
);

module.exports.Products = model('Products', ProductsSchema);
