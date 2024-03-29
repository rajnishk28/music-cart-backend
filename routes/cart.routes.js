const router =require('express').Router();
const { addToCart, getAllCartItems,cartItemCount }= require('../controllers/cart.controller');
const verifyToken = require('../middleware/verifyToken');

// Route to add an item to the cart
router.post('/add', verifyToken, addToCart);
router.get('/count', verifyToken, cartItemCount);

// Route to get all cart items based on user ID
router.get('/all/:userId', verifyToken, getAllCartItems);



module.exports = router;