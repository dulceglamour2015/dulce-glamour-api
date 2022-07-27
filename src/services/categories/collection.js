const { Schema, model } = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const CategorySchema = new Schema(
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

CategorySchema.index({ nombre: 'text' });
CategorySchema.plugin(mongoosePaginate);
CategorySchema.plugin(mongooseDelete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: false,
});

module.exports.Categoria = model('Categoria', CategorySchema);
