require('dotenv').config()

const mongoose = require('mongoose');
const express = require("express")
const app = express()
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors")


//My Routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")
const paymentRoute = require("./routes/payment")




//DB Connection
mongoose.connect(process.env.DATABASE,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(() => {
        console.log("DB CONNECTED");
    });




//Middle Wares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())



//Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoute);



//Port
const port = process.env.PORT || 8000


//Server Start
app.listen(port, () => {
    console.log(`App is running at ${port}`);

})