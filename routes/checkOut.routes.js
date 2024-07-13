const router = require("express").Router();
const {
    getAllCheckouts,
    createCheckout,
    getOneCheckout,
    verifyPayment
} = require("../controllers/checkOut.controller");
const verifyToken = require('../middleware/verifyToken');



router.post("/create",verifyToken,createCheckout );
router.post("/verify",verifyToken,verifyPayment );
router.get("/getall",verifyToken,getAllCheckouts );
router.get("/getone/:id",verifyToken,getOneCheckout );



module.exports = router;