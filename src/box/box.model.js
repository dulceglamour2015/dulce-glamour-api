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

module.exports.Box = model('Apertura', BoxSchema);
