const { Schema, model } = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

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

ConceptSchema.index({ codigo: 'text', descripcion: 'text' });
ConceptSchema.plugin(mongoosePaginate);
ConceptSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
});

module.exports.Concept = model('Concept', ConceptSchema);
