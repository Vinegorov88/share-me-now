let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
  originalName: String,
  fileName: String,
  size: String,
  date: String,
  downloads: Number
});

let File = mongoose.model('File', schema);
module.exports = File;