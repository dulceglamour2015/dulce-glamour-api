const { Schema, model } = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

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

BoxSchema.index({ observation: 'text' });
BoxSchema.plugin(mongoosePaginate);
BoxSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

module.exports.Box = model('Apertura', BoxSchema);
