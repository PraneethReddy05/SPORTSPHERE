const express = require("express");
const router = express.Router();
const Products = require("../models/Products.js");
const Cart=require("../models/Cart.js");
const User = require("../models/Users.js");
const Seller = require("../models/Seller.js");
const Order = require("../models/Orders.js");
const passport = require("passport");
const {isUserLoggedIn,saveRedirectUrl} = require("../middleware.js");
const WrapAsync = require("../utils/WrapAsync.js");

//signup //user
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})
//login //user
router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})
//signup user
router.post("/signup", WrapAsync(async (req, res) => {
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
}));
router.post("/login",
    saveRedirectUrl, // middleware for redirection
    passport.authenticate('user-local', {failureRedirect: '/user/login',failureFlash: true,}),
    WrapAsync(async(req, res) => {
        let redirectUrl = res.locals.redirectUrl || "/home";
        req.flash('success', 'Successfully logged in as user!');
        res.redirect(redirectUrl);
    }
));
//add to cart
router.post("/cart/:productId/add",isUserLoggedIn,WrapAsync(async(req,res)=>{
    let userId = req.user._id;
    let { productId } = req.params;
    let { quantity } = req.body;
    quantity = parseInt(quantity); // Convert to number

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
        existingItem.quantity += quantity; // Update with selected quantity
    } else {
        cart.items.push({ productId, quantity });
    }

    await cart.save();
    req.flash("success", `${quantity} items added to cart!`);
    res.redirect(`/products/${productId}`);
}));
// cart get
router.get("/cart",isUserLoggedIn, WrapAsync(async(req, res) => {
    let userId=req.user._id;
    let cart=await Cart.findOne({userId}).populate("items.productId");
    // console.log(cart);
    if(!cart)
        cart=new Cart({userId});
    let items=cart.items;
    res.render("users/cart.ejs",{items});

}));
//update page
router.get("/cart/update",isUserLoggedIn,WrapAsync(async(req,res)=>{
    let userId=req.user._id;
    let cart=await Cart.findOne({userId}).populate("items.productId");
    // console.log(cart);
    if(!cart)
        cart=new Cart({userId});
    let items=cart.items;
    res.render("users/updateCart.ejs",{items});
}));
//update cart post
router.post("/cart/update",isUserLoggedIn, WrapAsync(async (req, res) => {
    let userId = req.user._id;
    let { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        return res.redirect("/cart");
    }
    for (let i = 0; i < productId.length; i++) {
        let item = cart.items.find(item => item.productId.toString() === productId[i]);
        if (item) {
            item.quantity = Math.max(1, parseInt(quantity[i])); // Ensure at least 1 quantity
        }
    }
    await cart.save();
    res.redirect("/user/cart");
}));
router.post("/cart/remove",isUserLoggedIn, WrapAsync(async (req, res) => {
    let userId = req.user._id;
    let { productId } = req.body;
    console.log(req.body);
    console.log(req.user._id);
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        // Remove the item from the cart array
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        
        await cart.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}));
router.get("/orders",isUserLoggedIn,WrapAsync(async(req,res)=>{
    let userid = req.user._id;
    let orders = await Order.find({userId:userid});
    // console.log(orders);
    // .populate("items.productId");
    res.render("users/orders.ejs",{orders});
}));
router.get("/order/:id",isUserLoggedIn,WrapAsync(async(req,res)=>{
    let {id} = req.params;
    let order = await Order.findById(id).populate("items.productId");
    res.render("users/order.ejs",{order});
}))
router.get("/order/finish/:id",isUserLoggedIn,WrapAsync(async(req,res)=>{
    let {id} = req.params;
    let order = await Order.findById(id).populate("items.productId");
    order.status = "delivered";
    for(let item of order.items){
        let seller = await Seller.findById(item.sellerId);
        seller.revenue = seller.revenue + (item.quantity * item.price);
        await seller.save();
    }
    order.save();
    req.flash("success","Thank You!! do not forget to give review.");
    res.redirect("/home");
}))

//Account management
router.get("/account",isUserLoggedIn,WrapAsync(async(req,res)=>{
    let userId = req.user._id;
    let user = await User.findById(userId);
    res.render("users/account.ejs",{user});
}));
//Account details update
router.post("/account/update",isUserLoggedIn,WrapAsync(async(req,res)=>{
    let userId = req.user._id;
    let { name, email, phone, street, pincode, city, state } = req.body;
    let user = await User.findById(userId);
    if(user){
        user.name = name;
        user.email = email;
        user.phone = phone;
        user.address.street = street;
        user.address.pincode = pincode;
        user.address.city = city;
        user.address.state = state;
    }
    await user.save();
    // console.log(user);
    req.flash("success","Successfully Saved Changes.")
    res.redirect("/home")
}));
module.exports = router;