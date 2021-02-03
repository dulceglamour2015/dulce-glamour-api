const { Schema, model } = require('mongoose');

const ConceptSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports.Concept = model('Concept', ConceptSchema);
