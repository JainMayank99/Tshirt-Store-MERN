const Category=require("../models/category")



exports.getCategoryById=(req,res,next,id)=>{

    Category.findById(id).exec((err,cate)=>{
        if(err){
            return res.status(400).json({
                error:"Category not found in DB"
            })
        }
        req.category=cate;
        next()
    })
}

exports.createCategory=(req,res)=>{
    const category =new Category(req.body);
    category.save((err,cate)=>{
        if(err){
            return res.status(400).json({
                error:"Not able to save Category"
            })
        }
        res.json({category});
    })
}

exports.getCategory=(req,res)=>{
    return res.json(req.category)

}

exports.getAllCategory=(req,res)=>{
    Category.find().exec((err,categories)=>{
        if(err){
            return res.status(400).json({
                error:"No Categories found"
            })
        }
        res.json(categories)
    })
}

exports.updateCategory=(req,res)=>{
    const category=req.category;
    category.name=req.body.name;

    category.save((err,updatedCategory)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to update Category"
            })
        }
        res.json(updatedCategory)
    })
}

exports.removeCategory=(req,res)=>{
    const category=req.category

    category.remove((err,category)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to delete Category"
            })
        }
        res.json({
            message:`Successfully deleted ${category.name} category `
        })
    })
}