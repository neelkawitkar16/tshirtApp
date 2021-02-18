const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/authentication");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");

const { getOrderById, createOrder, getAllOrders, getOrderStatus, updateStatus } = require("../controllers/order");

//params
router.get("userId", getUserById);
router.get("orderId", getOrderById);

//create
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder);

//read
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders);

//order status
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus);
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus);

module.exports = router;