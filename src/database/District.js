const { Schema, model } = require('mongoose');

const DistrictSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports.District = model('District', DistrictSchema);
