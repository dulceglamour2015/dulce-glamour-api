const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const mongooseDelete = require('mongoose-delete');

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
    precioUnd: {
      type: Number,
      trim: true,
    },
    precioOferta: {
      type: Number,
      trim: true,
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
    oferta: {
      type: Boolean,
      default: false,
    },
    ecommerce: {
      type: Boolean,
      default: false,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    images: [{ type: String }],
  },
  { timestamps: true }
);

ProductsSchema.index({ nombre: 'text' });
ProductsSchema.plugin(mongoosePaginate);
ProductsSchema.plugin(mongooseAggregatePaginate);
ProductsSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
  deletedBy: true,
});

module.exports.Products = model('Products', ProductsSchema);
