const { Schema, model } = require('mongoose');

const ConceptSchema = new Schema(
  {
    codigo: {
      type: String,
      required: true,
      trim: true,
    },

    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports.Concept = model('Concept', ConceptSchema);
