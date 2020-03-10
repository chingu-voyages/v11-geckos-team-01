const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  github: {
    id: { type: String, require: true },
    displayName: { type: String, require: true },
    username: { type: String, require: true }
  },
  templateIds: Array,
  schemaIds: Array
});

module.exports = mongoose.model('user', userSchema);
