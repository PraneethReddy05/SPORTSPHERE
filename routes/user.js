const express = require("express");
const router = express.Router();
const Products = require("../models/Products.js");
const Cart=require("../models/Cart.js");
const User = require("../models/Users.js");
const passport = require("passport");


//signup //user
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})
//login //user
router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})
//signup user
router.post("/signup", async (req, res) => {
    try {
        let { username,name, email, phone, street, pincode, city, state, password } = req.body;
        let newUser = new User ({ username,name, email, phone, address: { street, pincode, city, state } });
        // console.log(newUser);
        const registeredUser = await User.register(newUser, password);
        const newCart = new Cart({userId:registeredUser._id});
        // console.log(newCart);
        req.login(registeredUser,(err)=>{
            if(err){
                console.log(err);
            }
            req.flash("success","Successfully Registered!!");
            res.redirect("/products");
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/home");
        console.log(err.message);
    }
})
router.post("/login",passport.authenticate('user-local', {failureRedirect: '/user/login',failureFlash: true,}),async(req, res) => {
    req.flash('success', 'Successfully logged in as user!');
    res.redirect("/home");
});
//add to cart
router.post("/cart/:productId/add",async(req,res)=>{
    let userId = req.user._id;
    // console.log("User Id"+userId);
    // console.log(req.params);
    let {productId}=req.params;
    // console.log("Prod Id"+productId);
    let cart=await Cart.findOne({userId});
    if(!cart){
        cart=new Cart({userId});
    }
    const existingItem=cart.items.find(item=>item.productId.toString()===productId);
    if(existingItem){
        existingItem.quantity+=1;
    }else{
        cart.items.push({productId,quantity:1});
    }
    await cart.save();
    req.flash("success","Added to cart!");
    res.redirect(`/products/${productId}`);
})
// cart get
router.get("/cart", async(req, res) => {
    let userId=req.user._id;
    let cart=await Cart.findOne({userId}).populate("items.productId");
    console.log(cart);
    if(!cart)
        cart=new Cart({userId});
    let items=cart.items;
    res.render("users/cart.ejs",{items});

});

module.exports = router;