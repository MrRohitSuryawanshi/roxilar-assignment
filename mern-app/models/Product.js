const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Ensure unique ID
    title: { type: String, required: true }, // Product title
    description: { type: String, required: true }, // Product description
    price: { type: Number, required: true }, // Price of the product
    category: { type: String, required: true }, // Category (e.g., electronics, furniture, etc.)
    sold: { type: Boolean, default: false }, // Whether the item is sold
    image: { type: String, required: true }, // Single image URL
    dateOfSale: { type: Date, required: true } // Date of sale
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
