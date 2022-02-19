const { Schema, model } = require('mongoose');

const PurchaseSchema = new Schema(
  {
    proveedor: {
      type: Schema.Types.ObjectId,
      trim: true,
      require: true,
      ref: 'Provider'
    },
    factura: {
      type: String,
      trim: true,
      required: true
    },
    productos: {
      type: Array,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports.Purchase = model('Purchase', PurchaseSchema);
