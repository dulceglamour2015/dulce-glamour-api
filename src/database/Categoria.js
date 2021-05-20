const { Schema, model } = require('mongoose');

const CategoriaSchema = new Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports.Categoria = model('Categoria', CategoriaSchema);
