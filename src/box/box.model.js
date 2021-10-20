const { Schema, model } = require('mongoose');

const BoxSchema = new Schema(
  {
    date: {
      type: String,
      trim: true,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    observation: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

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

module.exports.TreasuryResult = model('Tesoreria', TreasurySchema);
module.exports.Box = model('Apertura', BoxSchema);
