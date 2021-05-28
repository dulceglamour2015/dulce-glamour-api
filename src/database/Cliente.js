const { Schema, model } = require('mongoose');

const ClientesSchema = new Schema(
  {
    cedula: {
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
    mail: {
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
    },
    provincia: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'District',
    },
    estado: {
      type: Boolean,
      trim: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports.Cliente = model('Cliente', ClientesSchema);
