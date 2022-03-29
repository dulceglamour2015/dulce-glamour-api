const { Schema, model } = require('mongoose');
const mongooseDelete = require('mongoose-delete');

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

CategoriaSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

module.exports.Categoria = model('Categoria', CategoriaSchema);
