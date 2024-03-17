const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    company: String,
    color: String,
    price: Number,
    headphoneType: String,
    description: String,
    imageUrl: String,
    quantity: Number,
    rating: Number,
    
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;