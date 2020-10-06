const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
        name: {
            type: String,
            maxlength: 32,
            trim: true,
            required: true
        },
        description: {
            type: String,
            maxlength: 2000,
            trim: true,
            required: true
        },
        price: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        },
        category: {
            type: ObjectId,
            ref: "Category",
            required: true
        },
        stock: {
            type: Number
        },
        sold: {
            type: Number,
            default: 0
        },
        photo: {
            data: Buffer,
            contentType: String
        }
    }, 
    { timestamps: true}
);

module.exports = mongoose.Model("Product", productSchema);