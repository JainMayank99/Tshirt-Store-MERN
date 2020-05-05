const User=require("../models/user")
const Order=require("../models/order")


exports.getUserById=(req,res,next,id)=>{
    User.findById(id,(err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"User Not found in DB"
            })
        }
        req.profile=user;
        next();
    })
}

//for user to get his details
exports.getUser=(req,res)=>{
    
    
    req.profile.salt=undefined
    req.profile.encry_password=undefined
    req.profile.createdAt=undefined;
    req.profile.updatedAt=undefined

    return res.json(req.profile)
}

//for users to update their detail
exports.updateUser=(req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},//req.body will have values from frontend to be updated
        {new:true,useFindAndModify:false},
        (err,user)=>{
            if(err){
                return res.status(400).json({
                    error:"Not authorized to update a user"
                })
            }
            user.salt=undefined
            user.encry_password=undefined
            user.createdAt=undefined;
            user.updatedAt=undefined
            res.json(user)
        }
    )
}

//for user to see their previous order history 
//Done via matching userId via order model
// can be done also by purchase list of user model
exports.userPurchaseList=(req,res)=>{
    //taking the order schema and searching there by userId
    Order.find({user:req.profile._id})//can also do by taking purchase list array from user model of that userId
    .populate("user","_id name")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"No order in this account"
            })
        }
        return res.json(order)
    })
}
//pushing orders into purchase list
exports.pushOrderInPurchaseList=(req,res,next)=>{
    let purchases=[];

    //pushing item in array
    req.body.order.products.forEach(product=>{
        purchases.push({
            _id:product._id,
            name:product.name,
            description:product.description,
            category:product.category,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        })
    })
    //Store array in user model
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push: {purchases:purchases}},
        {new:true},
        (err,purchases)=>{
            if(err){
                return res.status(400).json({
                    error:"Unable to save Purchase List"
                })
            }
            next();
        }
    )
   
}





// exports.getAllUsers=(req,res)=>{
//     User.find((err,user)=>{
//         if(err||!user)
//         {
//             return res.status(400).json({
//                 error:"User not found / DB error"
//             })
//         }
//         return res.json(user)
//     })
// }

