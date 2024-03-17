const router =require("express").Router();
const {searchAndSortProducts} = require("../controllers/product.controller");



router.get("/getall", searchAndSortProducts);



module.exports = router;