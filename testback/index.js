const express = require("express");
const app = express();
const port = 8000;

app.get('/',  (req,res) => {
    return res.send("Home page");
});

app.get('/login', (req,res) => {
    return res.send("You are visiting login route");
});


const admin = (req, res) => {
    return res.send("this is admin dashboard");
}
const isLoggedIn = (req, res, next) => {
    console.log("isLoggedIn is running");
    next();
}

const isAdmin = (req, res, next) => {
    console.log("isAdmin is running");
    next();
}
app.get('/admin', isLoggedIn, isAdmin, admin);


app.get('/signup', (req,res) => {
    return res.send("You are visiting signup route");
});

app.get('/logout', (req,res) => {
    return res.send("User has signed out");
});

app.listen(port, () => {
    console.log("Server is up and running...");
});