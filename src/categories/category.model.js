const { Schema, model } = require('mongoose');

const CategoriaSchema = new Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
      unique: true,
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
  {
    timestamps: true,
  }
);

module.exports.Categoria = model('Categoria', CategoriaSchema);
