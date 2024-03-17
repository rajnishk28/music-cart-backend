const express = require("express");
const app = express();
const cors =require("cors");
const userRoutes =require("./routes/user.routes");



app.use(express.json());
app.use(cors());

app.use("/api",userRoutes);



app.get("/", (req, res) => {
    res.send("hello")
});





module.exports = app;