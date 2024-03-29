const router = require("express").Router();
const {
    getAllCheckouts,
    createCheckout,
    getOneCheckout
} = require("../controllers/checkOut.controller");
const verifyToken = require('../middleware/verifyToken');



router.post("/create",verifyToken,createCheckout );
router.get("/getall",verifyToken,getAllCheckouts );
router.get("/getone/:id",verifyToken,getOneCheckout );



module.exports = router;