const mongoose = require('mongoose');

const { Schema } = mongoose;

const jsonSchema = new Schema({
  jsonRaw: String,
  jsonSchema: String,
  quantity: Number,
  userId: { type: Schema.Types.ObjectId, ref: 'user' },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('json-schema', jsonSchema);
