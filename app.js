const express = require("express");
const app = express();
const cors =require("cors");
const userRoutes =require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const feedbackRoutes = require("./routes/feedback.routes");



app.use(express.json());
app.use(cors());

app.use("/user",userRoutes);
app.use("/product",productRoutes);
app.use("/cart",cartRoutes);
app.use("/feedback",feedbackRoutes);



app.get("/", (req, res) => {
    res.send("hello")
});





module.exports = app;