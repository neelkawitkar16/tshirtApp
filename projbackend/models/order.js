const mongoose = require("mongoose");
const product = require("./product");
const { ObjectId } = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
    name: String,
    product: {
        type: ObjectId,
        ref: "Product"
    },
    count: Number,
    price: Number
});
const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

const OrderSchema = new mongoose.Schema({
        products: [ProductCartSchema],
        transaction_id: {},
        amount: { type: Number},
        address: String,
        updated: Date,
        user: {
            type: ObjectId,
            ref: "User"
        }
    },
    {timestamps: true}
);
const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order, ProductCart};