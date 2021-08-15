const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductsSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    existencia: {
      type: Number,
      required: true,
      trim: true,
    },
    stockMin: {
      type: Number,
      trim: true,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
      trim: true,
    },
    precioCompra: {
      type: Number,
      trim: true,
      required: true,
    },
    marca: {
      type: String,
      required: true,
      trim: true,
    },
    undMed: {
      type: String,
      required: true,
      trim: true,
    },
    presentacion: {
      type: String,
      required: true,
      trim: true,
    },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: 'Categoria',
      required: true,
      trim: true,
    },
    combo: {
      type: Boolean,
      trim: true,
      default: false,
    },
    productosCombo: {
      type: Array,
      trim: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

ProductsSchema.index({ nombre: 'text' });

module.exports.Products = model('Products', ProductsSchema);
