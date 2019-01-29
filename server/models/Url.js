const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  url: {
    type: String,
    default: '',
  },
  tinyUrl: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Url', UrlSchema);
