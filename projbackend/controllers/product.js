const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs"); //file system
const { sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
        if(err){
            return res.status(400).json({
                error: "Product NOT found"
            });
        }
        req.product = product;
        next();
    });
}

exports.createProduct = (req, res) => {
    let  form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return status(400).json({
                error: "Problem with image"
            });
        }
        //destructure the fields
        const {name, description, price, category, stock} = fields;
        
        //simple validation
        if(!name || !description || !price || !category || !stock){
           return res.status(400).json({
                error: "Please include all the fields"
            });
        }
        
        let product = new Product(fields);

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size is greater than 3MB"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path); //data and contentType are properties of photo
            product.photo.contentType = file.photo.type;
        }
        //console.log(product);

        //save to the DB
        product.save((err, product) => {
            if(err){
               return res.status(400).json({
                    error: "Saving tshirt to the DB failed"
                });
            }
            res.json(product);
        });
    });
}


//read controller
exports.getProduct = (req,res) => {
    req.product.photo = undefined;  //since photos can be bulky to grab from DB, we need middleware to handle
    return res.json(req.product);
}

//middleware
exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}


//delete controller
exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: "Failed to DELETE the product!"
            });
        }
        res.json({
            message: "Product was DELETED successfully", 
            deletedProduct
        });
    }); 
}


//update controller
exports.updateProduct = (req, res) => {
    let  form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return status(400).json({
                error: "Problem with image"
            });
        }
        
        //updation code
        let product = req.product;
        product = _.extend(product, fields);

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size is greater than 3MB"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path); //data and contentType are properties of photo
            product.photo.contentType = file.photo.type;
        }
        //console.log(product);

        //save to the DB
        product.save((err, product) => {
            if(err){
               return res.status(400).json({
                    error: "UPDATION of the product failed"
                });
            }
            res.json(product);
        });
    });
}


//list all products
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[ sortBy, "asc" ]])
    .limit(limit)
    .exec((err, products) => {
        if(err){
            return res.status(400).json({
                error: "NO products found!"
            });
        }
        res.json(products);
    });
}


exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if(err){
            return res.status(400).json({
                error: "NO category found"
            });
        }
        res.json(category);
    });
}


exports.updateStock = (req, res) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: {stock: -prod.count, sold: +prod.count } }
            }
        }
    });

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err){
            return res.status(400).json({
                error: "Bulk operation failed!"
            });
        }
        next();
    });
}