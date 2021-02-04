const { Schema, model } = require('mongoose');

const ExpenseSchema = new Schema(
  {
    proveedor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Provider',
      trim: true,
    },
    concepto: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Concept',
      trim: true,
    },
    comprobante: {
      type: String,
      required: true,
      trim: true,
    },
    importe: {
      type: Number,
      required: true,
      trim: true,
    },
    observacion: {
      type: String,
      trim: true,
    },
    comprobanteDate: {
      trim: true,
      type: String,
    },
    creado: {
      trim: true,
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);
module.exports.Expense = model('Expense', ExpenseSchema);
