var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const {signout, signup, signin, isSignedIn} = require("../controllers/authentication");

router.post("/signup", [
    check('name').isLength({ min: 3 }).withMessage('name should be at least 3 chars long'),
    check('email').isEmail().withMessage('email is required'),
    check('password').isLength({ min: 3 }).withMessage('password should be at least 3 chars long')
], signup);

router.post("/signin", [
    check('email').isEmail().withMessage('email is required'),
    check('password').isLength({ min: 1 }).withMessage('password field is required')
], signin);

//router.get("/signout", isSignedIn, signout);
router.get("/signout", signout);

module.exports = router;