const mongoose = require('mongoose');
const Product = require("./product.model")
const User = require("./user.model")

const checkoutSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    items: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product' 
        },
        quantity: { 
            type: Number,
            default: 1 
        }
    }],
    totalPrice: { 
        type: Number,
        required: true 
    },
    customerName: { 
        type: String,
        required: true 
    },
    shippingAddress: { 
        type: String,
        required: true 
    },
    paymentMethod: { 
        type: String,
        enum: ['credit_card', 'cash', 'upi'],
        required: true 
    },
    status: { 
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
        default: 'Pending' 
    },
    razorpayOrderId: {
        type: String,
        required: false
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    }
},{timestamps: true});

// Create Checkout model
const Checkout = mongoose.model('Checkout', checkoutSchema);

module.exports = Checkout;
