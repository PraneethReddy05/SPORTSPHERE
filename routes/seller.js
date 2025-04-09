const express = require("express");
const router = express.Router();
const Products = require("../models/Products.js");
const Cart=require("../models/Cart.js");
const User = require("../models/Users.js");
const Seller = require("../models/Seller.js");
const Order = require("../models/Orders.js");
const passport = require("passport");
const {isSellerLoggedIn,saveRedirectUrl,updateOrderStatusIfUniform} = require("../middleware.js");
const WrapAsync = require("../utils/WrapAsync.js");

//signup //seller
router.get("/signup", (req, res) => {
    res.render("sellers/signup.ejs")
})

//login //seller
router.get("/login", (req, res) => {
    res.render("sellers/login.ejs")
})

//signup seller
router.post("/signup", async (req, res) => {
    try {

        let { username,name,storeName,email, phone, street, pincode, city, state, password } = req.body;
        let newSeller = new Seller ({ username,name,storeName, email, phone, address: { street, pincode, city, state } });
        // console.log(newUser);
        const registeredSeller=await Seller.register(newSeller, password);
        req.login(registeredSeller,(err)=>{
            if(err){
                console.log(err);
            }
            req.flash("success","Successfully Registered!!");
            console.log(req.user);
            res.redirect("/seller/dashboard");
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/home");
        console.log(err);
    }
})

//login seller
router.post("/login",
    saveRedirectUrl,
    passport.authenticate('seller-local', {failureRedirect: '/seller/login',failureFlash: true,}),
    WrapAsync(async(req, res) => {
        let redirectUrl = res.locals.redirectUrl || '/seller/dashboard';
        req.flash('success', 'Successfully logged in as seller!');
        res.redirect(redirectUrl);
    }
));

//Seller dashboard
router.get("/dashboard",isSellerLoggedIn, WrapAsync(async (req,res)=>{
    // console.log(req.user);
    // const {_id} = req.user;
    const seller = await Seller.findById(req.user._id).populate("products");
    // console.log(seller);
    res.render("sellers/dashboard.ejs",{seller});
}));

//seller adding new product
router.get("/product/new",isSellerLoggedIn,(req,res)=>{
    // let {id} = req.params;
    // console.log(id);
    res.render("sellers/newProductForm.ejs");
});

//new product
router.post("/product/new",isSellerLoggedIn,WrapAsync(async(req,res)=>{
    // let {id} = req.params;
    let newProduct = new Products({...req.body.product,sellerId:req.user._id});
    let seller = await Seller.findByIdAndUpdate(req.user._id,{ $push: { products: newProduct } });
    await newProduct.save();
    res.redirect("/seller/dashboard");
    // console.log(newProduct);
    // console.log(req.body);
}));
router.get("/orders",isSellerLoggedIn,WrapAsync(async(req,res)=>{
    let userid = req.user._id;
    let seller = await Seller.findById(userid).populate("orders");
    // console.log(orders);
    // .populate("items.productId");
    // console.log(seller);
    res.render("sellers/orders.ejs",{seller});
}));
router.get("/order/:id",isSellerLoggedIn,WrapAsync(async(req,res)=>{
    let {id} = req.params;
    let order = await Order.findById(id).populate("items.productId");
    // console.log(order);
    res.render("sellers/order.ejs",{order,sellerId:req.user._id});
}))

//Status update of orders
router.post("/order/:id",isSellerLoggedIn,WrapAsync(async(req,res)=>{
    let {id} = req.params;
    let {items} = req.body;
    // console.log(items);
    let order = await Order.findById(id);
    for(let item of items){
        let orderItem = order.items.find(i => i.productId.toString() == item.productId.toString());
        let product = await Products.findById(orderItem.productId);
        if(product){
            product.stock = product.stock - 1;
            await product.save();
        }
        if(orderItem)orderItem.status = item.status;
    }
    await updateOrderStatusIfUniform(order);
    await order.save();
    res.redirect("/seller/orders")
}));
module.exports = router;