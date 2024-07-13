const Checkout = require('../models/checkout.model');
const Cart = require('../models/cart.model');
const Razorpay = require('razorpay');
const crypto = require("crypto");

var instance = new Razorpay({
    key_id: process.env.keyId,
    key_secret: process.env.keySecret,
});

const getAllCheckouts = async (req, res) => {
    const userId = req.user;
    try {
        const checkouts = await Checkout.find({ userId });
        res.status(200).json(checkouts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createCheckout = async (req, res) => {
    try {
        const userId = req.user;

        // Create Razorpay order
        const options = {
            amount: req.body.totalPrice * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: "receipt#1",
        };
        const order = await instance.orders.create(options);

        const checkout = new Checkout({
            userId: userId,
            items: req.body.items,
            totalPrice: req.body.totalPrice,
            customerName: req.body.customerName,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            status: req.body.status,
            razorpayOrderId: order.id,
        });

        const newCheckout = await checkout.save();

        // Remove cart items after successful checkout
        await Cart.deleteMany({ userId: userId });

        res.status(201).json(newCheckout);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
      
        const expectedSignature = crypto.createHmac('sha256', process.env.keySecret)
                                        .update(body.toString())
                                        .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Update payment status
            const checkout = await Checkout.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { paymentStatus: 'Paid' },
                { new: true }
            );
            res.status(200).json({ message: "Payment verified successfully", checkout });
        } else {
            res.status(400).json({ message: "Invalid payment signature" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getOneCheckout = async (req, res) => {
    const userId = req.user;
    const checkoutId = req.params.id;
    try {
        const checkout = await Checkout.findOne({ _id: checkoutId, userId: userId }).populate('items.productId', 'name price imageUrl');
        if (!checkout) {
            return res.status(404).json({ message: 'Checkout not found' });
        }
        res.status(200).json(checkout);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllCheckouts,
    createCheckout,
    getOneCheckout,
    verifyPayment
};
