const express = require("express");
const app = express();
const cors =require("cors");
const userRoutes =require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const checkOutRoutes = require("./routes/checkOut.routes");



app.use(express.json());
app.use(cors());

app.use("/user",userRoutes);
app.use("/product",productRoutes);
app.use("/cart",cartRoutes);
app.use("/feedback",feedbackRoutes);
app.use("/checkout",checkOutRoutes);



app.get("/", (req, res) => {
    res.send("hello")
});





module.exports = app;