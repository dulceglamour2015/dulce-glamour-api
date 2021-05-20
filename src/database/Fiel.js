const { Schema, model } = require('mongoose');

const fileSchema = new Schema({
  id: Schema.Types.ObjectId,
  url: String
});

module.exports.File = model('File', fileSchema);
