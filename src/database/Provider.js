const { Schema, model } = require('mongoose');

const ProviderSchema = new Schema(
  {
    ruc: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    telefono: {
      type: String,
      required: true,
      trim: true,
    },
    direccion: {
      type: String,
      trim: true,
      required: true,
    },
    contacto: {
      type: String,
      trim: true,
      required: true,
    },
    estado: {
      type: Boolean,
      trim: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports.Provider = model('Provider', ProviderSchema);
