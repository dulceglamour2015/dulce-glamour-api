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
    registroDate: {
      trim: true,
      type: String,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
      trim: true,
    },
    creado: {
      trim: true,
      type: Date,
      default: new Date(),
    },
    type: {
      trim: true,
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CorrelativeExpense = new Schema(
  {
    correlative: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports.CorrelativeExpense = model(
  'CorrelativeExpense',
  CorrelativeExpense
);
module.exports.Expense = model('Expense', ExpenseSchema);