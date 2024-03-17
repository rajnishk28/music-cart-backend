const router =require("express").Router();

const {registerUser,loginUser,updateUserDetails
,getOneUser} =require("../controllers/user.controller");


router.post("/signup",registerUser);
router.post("/login",loginUser);
router.put("/update/:id",updateUserDetails);
router.get("/getone/:id",getOneUser);



module.exports =router;
    