const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema


//For Cart purposes 
const ProductCartSchema=new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"Product",
    },
    name:String,
    count:Number,
    price:Number,

})
const ProductCart=mongoose.model("ProductCart",ProductCartSchema);

//For Ordering
const OrderSchema = new mongoose.Schema({
    products: [ProductCartSchema],
    transaction_id: {},
    amount: {
        type: Number,
    },
    address: {
        type: String,
    },
    status:{
        type:String,
        default:"Received",
        enum:["Cancelled","Delivered","Shipped","Processing","Received"]
    },
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User",
    },
}, { timestamps: true })

const Order=mongoose.model("Order",OrderSchema);



module.exports={Order,ProductCart};