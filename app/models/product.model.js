const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  name: String,
  categoryId: String,
  description: String,
  price: String,
}, {
  timestamp: true
});

module.exports = mongoose.model('Product', ProductSchema);
