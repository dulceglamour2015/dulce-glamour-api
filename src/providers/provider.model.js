const { Schema, model } = require('mongoose');

const ProviderSchema = new Schema(
  {
    ruc: {
      type: String,
      unique: true,
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

module.exports.Provider = model('Provider', ProviderSchema);
