const { Schema, model } = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const TreasurySchema = new Schema(
  {
    box: {
      type: Number,
      trim: true,
      required: true,
    },
    income: {
      type: Number,
      trim: true,
      required: true,
    },
    expense: {
      type: Number,
      trim: true,
      required: true,
    },
    balance: {
      type: Number,
      trim: true,
      required: true,
    },
    from: {
      type: String,
      trim: true,
      required: true,
    },
    to: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

TreasurySchema.plugin(mongoosePaginate);
TreasurySchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

module.exports.TreasuryResult = model('Tesoreria', TreasurySchema);
