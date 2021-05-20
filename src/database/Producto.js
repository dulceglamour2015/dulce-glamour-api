const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductosSchema = new Schema(
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
    creado: {
      type: Date,
      default: Date.now()
    }
  },
  { timestamps: true }
);

ProductosSchema.plugin(mongoosePaginate);
ProductosSchema.index({ nombre: 'text' });

module.exports.Producto = model('Producto', ProductosSchema);
