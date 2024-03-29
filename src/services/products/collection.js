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
      unique: true,
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
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  },
  { timestamps: true }
);

ProductsSchema.index({ nombre: 'text' });
ProductsSchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
});
ProductsSchema.plugin(mongoosePaginate);
ProductsSchema.plugin(mongooseAggregatePaginate);

module.exports.Products = model('Products', ProductsSchema);
