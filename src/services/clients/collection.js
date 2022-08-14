const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoosePaginateAggregate = require('mongoose-aggregate-paginate-v2');
const mongooseDelete = require('mongoose-delete');

const ClientesSchema = new Schema(
  {
    cedula: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    mail: {
      type: String,
      required: true,
      trim: true,
    },
    telefono: {
      type: String,
      required: true,
      trim: true,
    },
    direccion: {
      type: String,
      trim: true,
    },
    provincia: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'District',
    },
  },
  { timestamps: true }
);

ClientesSchema.index({ nombre: 'text' });
ClientesSchema.plugin(mongoosePaginate);
ClientesSchema.plugin(mongoosePaginateAggregate);
ClientesSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: false,
  deletedBy: true,
});

module.exports.Cliente = model('Cliente', ClientesSchema);
