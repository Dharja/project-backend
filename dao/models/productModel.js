const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    keywords: [String],
    stock: { type: Number, default: 0 },
    createdDate: { type: Number, default: Date.now() },
    thumbnails: [String],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
