const CartItem = require('../models/cart.model');

// Function to add an item to the cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user; 
        const { productId, quantity } = req.body;

        // Check if the item already exists in the cart
        let existingItem = await CartItem.findOne({ userId, productId });

        if (existingItem) {
            // If the item already exists, update the quantity
            existingItem.quantity += quantity;
            await existingItem.save();
        } else {
            // If the item does not exist, create a new cart item
            await CartItem.create({ userId, productId, quantity });
        }

        return res.status(201).json({ message: 'Item added to cart successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error adding item to cart' });
    }
};

// Function to get all cart items based on user ID
const getAllCartItems = async (req, res) => {
    try {
        const userId = req.params.userId;

        const cartItems = await CartItem.find({ userId }).populate('productId');
    //  console.log(cartItems);
        return res.status(200).json({ cartItems });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error getting cart items' });
    }
};

const cartItemCount = async (req, res) => {
    try {
        const userId = req.user;
        const count = await CartItem.countDocuments({ userId });

        return res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error getting cart items' });
    }
};

module.exports = { addToCart, getAllCartItems,cartItemCount };
