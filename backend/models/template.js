const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const templateSchema = new Schema({
  json: String,
  template: String,
  userId: { type: Schema.Types.ObjectId, ref: 'user' },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('template', templateSchema);
