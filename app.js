const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Products = require("./models/Products.js");
const User = require("./models/Users.js");
const Seller = require("./models/Seller.js");
const Cart=require("./models/Cart.js");
const Order = require("./models/Orders.js")
const session = require("express-session");
const flash=require("connect-flash");
const passport = require("passport");
const Razorpay = require("razorpay");
const Product = require("./models/Products.js");
const ExpressError = require("./utils/ExpressError.js");
const WrapAsync = require("./utils/WrapAsync.js");
const crypto = require("crypto");//Used to create a secure HMAC hash to verify Razorpay's signature
require('dotenv').config(); // Load variables from .env
const {isUserLoggedIn,saveRedirectUrl} = require("./middleware.js");

//routers
const category = require("./routes/categories.js");
const reviews = require("./routes/reviews.js");
const products = require("./routes/products.js");
const users = require("./routes/user.js");
const sellers = require("./routes/seller.js");



//mongoDB connection
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/SPORTSPHERE")
}
main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);
})

//middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


// session middleware
const sessionoptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionoptions));
app.use(flash());

//middleware for passport
app.use(passport.initialize());
app.use(passport.session());
passport.use('user-local',User.createStrategy()); // Uses passport-local-mongoose's strategy
passport.use('seller-local',Seller.createStrategy()); // Uses passport-local-mongoose's strategy
passport.serializeUser((account, done) => {
    done(null, { id: account._id, role: account.role }); // Store both id and role in the session
});
passport.deserializeUser(async ({ id, role }, done) => {
    try {
        let account;
        if (role === 'User') {
            account = await User.findById(id);
        } else if (role === 'Seller') {
            account = await Seller.findById(id);
        }
        done(null, account);
    } catch (err) {
        done(err);
    }
});

//razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//flash messages middleware
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

//category router
app.use("/category",category);
app.use("/products/:id/reviews",reviews);
app.use("/products",products);
app.use("/user",users);
app.use("/seller",sellers);

//home route
app.get("/home",WrapAsync(async(req, res) => {
    const allProducts = await Products.find({});
    res.render("home.ejs",{allProducts});
    // res.send("home to be implemented")
}));

//contact
app.get("/contact", (req, res) => {
    res.send("Contact page");
})

//about us
app.get("/about", (req, res) => {
    res.send("About us page");
})

app.get("/search",WrapAsync(async(req,res)=>{
    let {query}=req.query;
    // console.log({query});
    const filteredProducts=await Products.find({
        $or:[
            {name:{$regex:query,$options:"i"}},
            {description:{$regex:query,$options:"i"}}
        ],
    })
    res.render("searchProducts.ejs",{filteredProducts,query});
}));

//checkout
app.get("/checkout",isUserLoggedIn,WrapAsync(async(req,res)=>{
    let userId=req.user._id;
    let user=await User.findById(userId);
    let cart=await Cart.findOne({userId}).populate("items.productId");

    let totalAmount=cart.items.reduce((total,item)=>{
        return total+item.productId.price*item.quantity;
    },0);

    res.render("users/checkout.ejs",{user,cart,totalAmount});
}));

//razorpay
app.post("/create-order", WrapAsync(async (req,res) => {
    const { totalAmount } = req.body; // Total amount from the request body
    try {
        const options = {
            amount: totalAmount * 100, // Razorpay requires the amount in paise
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`,
        };

        // Create the order using Razorpay SDK
        const order = await razorpayInstance.orders.create(options);
        // console.log(order);
        res.status(200).send({
            success: true,
            orderId: order.id, // Send the Razorpay order ID to the frontend
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).send({
            success: false,
            message: "Failed to create order. Please try again.",
        });
    }
}));
//to verify the payment
app.post("/verify-payment",WrapAsync(async(req,res)=>{
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");
    if (generated_signature === razorpay_signature) {
        let userId = req.user._id;
        let cart = await Cart.findOne({userId}).populate("items.productId");
        let order_items = [];
        let total = 0;
        for(let item of cart.items){
            order_items.push({
                "productId": item.productId._id,
                "quantity":item.quantity,
                "price":item.productId.price,
                "sellerId":item.productId.sellerId,
            })
            total += item.quantity * item.productId.price;
        }
        let newOrder = new Order({
            userId:userId,
            items:order_items,
            totalAmount:total,
        })
        let updatedSellers = new Set();
        for(let item of cart.items){
            let sellerId = item.productId.sellerId.toString();
            if(updatedSellers.has(sellerId))continue;
            let seller = await Seller.findByIdAndUpdate(item.productId.sellerId,{ $push: { orders: newOrder } });
            updatedSellers.add(sellerId)
        }
        cart.items = [];
        await cart.save();
        await newOrder.save()
        // console.log(newOrder);
        res.status(200).json({ success: true });
    }
}));

//After successful payment
app.get("/order-success",WrapAsync(async(req,res)=>{
    req.flash("success","Order Placed successfully!");
    res.redirect("/user/orders");
}));

app.post("/pay",WrapAsync(async(req,res)=>{
    res.status(200).send(req.body);
}));


//logout
app.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            console.log(err);
        }
        req.flash("success","You are logged out!")
        res.redirect("/home");
    })
})

//404 status error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

//Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message="Something went wrong!" } = err;
    res.render("error.ejs",{err});
})
//http://localhost:8080/order-success -payment success
app.listen(8080, (req, res) => {
    console.log("Listening on port 8080");
})