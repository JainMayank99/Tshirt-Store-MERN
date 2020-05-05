const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")//file system for getting path of files to be uploaded


exports.getProductById = (req, res, next, id) => {

  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found"
        })
      }
      req.product = product
      next();
    })
}

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;


  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    //destructuring of fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields"
      });
    }



    let product = new Product(fields);

    //file handle
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //Saving photo to DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Saving tshirt in DB failed"
        });
      }
      res.json(product);
    });
  });
};


exports.getProduct = (req, res) => {
  req.product.photo = undefined
  return res.json(req.product)
}


//Middleware for parallel loading of photo with getProduct
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType)
    return (res.send(req.product.photo.data))
  }
  next()
}

exports.deleteProduct = (req, res) => {
  //
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete Product"
      })
    }
    res.json({
      message: "Delete was successful",
      product: deletedProduct
    })
  })
}

exports.updateProduct = (req, res) => {
  //
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;


  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    //updation code

    //Since User might not want to update all the routes so to avoid re-entry of all data
    let product = req.product;

    //using lodash to update the previous fields to new fields
    product = _.extend(product, fields)


    //file handle
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //Saving photo to DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updation of product failed"
        });
      }
      res.json(product);
    });
  });

}

//List all products
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;//taking value from user else default 8
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")//so as not to select only photos
    .populate("category")
    .sort([[sortBy, "asc"]])//or can be like .sort([['updatedAt','descending']])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status.json({
          error: "No product found"
        })
      }
      res.json(products)
    })
}
//for getting all categories
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found"
      })
    }
    res.json(category)
  })
}

//updating stock middleware
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map(prod => {
    return {
      updateOne: {               //refer bulk-write mongoose docs for this syntax
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } }//prod.count is from front end and will contain how much quantity of product does user wants
      }
    }
  })

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed"
      })
    }
    next()
  })
}