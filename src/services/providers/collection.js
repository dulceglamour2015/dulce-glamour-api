const { Schema, model } = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const ProviderSchema = new Schema(
  {
    ruc: {
      type: String,
      trim: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    direccion: {
      type: String,
      trim: true,
    },
    contacto: {
      type: String,
      trim: true,
    },
    tipo: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

ProviderSchema.index({ nombre: 'text', ruc: 'text' });
ProviderSchema.plugin(mongoosePaginate);
ProviderSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

module.exports.Provider = model('Provider', ProviderSchema);
