const Checkout = require('../models/checkout.model');
const Cart = require('../models/cart.model');

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
        const checkout = new Checkout({
            userId: userId,
            items: req.body.items,
            totalPrice: req.body.totalPrice,
            customerName: req.body.customerName,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            status: req.body.status
        });

        const newCheckout = await checkout.save();

        // Remove cart items after successful checkout
        await Cart.deleteMany({ userId: userId });

        res.status(201).json(newCheckout);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getOneCheckout = async (req, res) => {
    const userId = req.user;
    const checkoutId = req.params.id; 
    try {
        const checkout = await Checkout.findOne({ _id: checkoutId, userId: userId });
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
    getOneCheckout
};
