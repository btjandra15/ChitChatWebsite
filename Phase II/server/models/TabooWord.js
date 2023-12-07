const mongoose = require('mongoose');
const TabooWordSchema = new mongoose.Schema({
  word: { 
    type: String, 
    required: true, 
    unique: true 
},
});
const TabooWord = mongoose.model('TabooWord', TabooWordSchema);
module.exports = TabooWord;