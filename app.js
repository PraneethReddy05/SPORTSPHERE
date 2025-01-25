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
const Review=require("./models/Reviews.js");
const session = require("express-session");
const flash=require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Razorpay = require("razorpay");
const Product = require("./models/Products.js");
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/SPORTSPHERE")
}

main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log(err);
})


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
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
    key_id: "rzp_test_8RlMHbMDNhfWw4",
    key_secret: "015SxpmJtj6mkX5TZGAKLJim",
});

//flash messages middleware
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

//middlewares for handling unautorized access
// function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     req.flash('error', 'You must be logged in!');
//     res.redirect('/login');
// }

// function ensureRole(role) {
//     return (req, res, next) => {
//         if (req.isAuthenticated() && req.user.role === role) {
//             return next();
//         }
//         req.flash('error', 'Access denied!');
//         res.redirect('/login');
//     };
// }


//home route
app.get("/home", async (req, res) => {
    
    res.render("home.ejs");
    // res.send("home to be implemented")
})

//view all products
app.get("/products", async (req, res) => {
    const allProducts = await Products.find({});
    res.render("products.ejs", { allProducts });
})

//product details
app.get("/products/:id", async (req, res) => {
    let { id } = req.params;
    let product = await Products.findById(id).populate({path:"reviews",populate:{path:"author"}});
    res.render("details.ejs", { product });
})

//contact
app.get("/contact", (req, res) => {
    res.send("Contact page");
})

//about us
app.get("/about", (req, res) => {
    res.send("About us page");
})


//signup //user
app.get("/signup/user", (req, res) => {
    res.render("users/signup.ejs")
})
//signup //seller
app.get("/signup/seller", (req, res) => {
    res.render("sellers/signup.ejs")
})

//login //user
app.get("/login/user", (req, res) => {
    res.render("users/login.ejs")
})
//login //seller
app.get("/login/seller", (req, res) => {
    res.render("sellers/login.ejs")
})



app.get("/search",async(req,res)=>{
    let {query}=req.query;
    console.log({query});

    try{
        const filteredProducts=await Products.find({
            $or:[
                {name:{$regex:query,$options:"i"}},
                {description:{$regex:query,$options:"i"}}
            ],
        })
    
        res.render("searchProducts.ejs",{filteredProducts,query});
    }
    catch(err){
        console.log(err);
    }
})
 
//signup user
app.post("/signup/user", async (req, res) => {
    try {
        // console.log("Signup data: ", req.body);

        let { username,name, email, phone, street, pincode, city, state, password } = req.body;
        let newUser = new User ({ username,name, email, phone, address: { street, pincode, city, state } });
        // console.log(newUser);
        const registeredUser=await User.register(newUser, password);
        const newCart=new Cart({userId:registeredUser._id});
        console.log(newCart);
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


app.post("/login/user",passport.authenticate('user-local', {failureRedirect: '/login/user',failureFlash: true,}),async(req, res) => {
    req.flash('success', 'Successfully logged in as user!');
    res.redirect("/home");
});

//User dashboard
// app.get('/user/dashboard', ensureAuthenticated, ensureRole('user'), (req, res) => {
//     res.send('Welcome to the user dashboard!');
// });

//signup seller
app.post("/signup/seller", async (req, res) => {
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
        res.redirect("/signup/user");
        console.log(err);
    }
})

//login seller
app.post("/login/seller",passport.authenticate('seller-local', {failureRedirect: '/login/seller',failureFlash: true,}),async(req, res) => {
        req.flash('success', 'Successfully logged in as seller!');
        res.redirect('/seller/dashboard');
    }
);


//Seller dashboard
app.get("/seller/dashboard", async (req,res)=>{
    console.log(req.user);
    // const {_id} = req.user;
    const seller = await Seller.findById(req.user._id).populate("products");
    // console.log(seller);
    res.render("sellers/dashboard.ejs",{seller});
})

//seller adding new product
app.get("/seller/product/new",(req,res)=>{
    // let {id} = req.params;
    // console.log(id);
    res.render("sellers/newProductForm.ejs");
});

//new product
app.post("/seller/product/new",async(req,res)=>{
    // let {id} = req.params;
    let newProduct = new Products(req.body.product);
    let seller = await Seller.findByIdAndUpdate(req.user._id,{ $push: { products: newProduct } });
    await newProduct.save();
    res.redirect("/seller/dashboard");
    // console.log(newProduct);
    // console.log(req.body);
});

//edit product

app.get("/products/:productId/edit",async(req,res)=>{
    let {productId}=req.params;
    // console.log(productId);
    let product= await Products.findById(productId);
    // console.log(product);
    res.render("sellers/edit.ejs",{product});
});

//edit product post

app.put("/products/:productId/edit",async (req,res)=>{
    let {productId}=req.params;
    await Products.findByIdAndUpdate(productId,{...req.body.product});
    res.redirect("/seller/dashboard");
})

//product delete
app.delete("/products/:productId",async(req,res)=>{
    let {productId}=req.params;
    await Products.findByIdAndDelete(productId);
    res.redirect("/seller/dashboard");
})

//add to cart
app.post("/cart/:productId/add",async(req,res)=>{
    let userId=req.user._id;
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
app.get("/cart", async(req, res) => {
    let userId=req.user._id;
    let cart=await Cart.findOne({userId}).populate("items.productId");
    console.log(cart);
    if(!cart)
        cart=new Cart({userId});
    let items=cart.items;
    res.render("users/cart.ejs",{items});

});

//checkout
app.get("/checkout",async(req,res)=>{
    let userId=req.user._id;

    let user=await User.findById(userId);
    let cart=await Cart.findOne({userId}).populate("items.productId");

    let totalAmount=cart.items.reduce((total,item)=>{
        return total+item.productId.price*item.quantity;
    },0);

    res.render("users/checkout.ejs",{user,cart,totalAmount});
})

//razorpay
app.post("/create-order", async (req, res) => {
    const { totalAmount } = req.body; // Total amount from the request body
    console.log(req.body);

    try {
        const options = {
            amount: totalAmount * 100, // Razorpay requires the amount in paise
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`,
        };

        // Create the order using Razorpay SDK
        const order = await razorpayInstance.orders.create(options);

        res.status(200).json({
            success: true,
            orderId: order.id, // Send the Razorpay order ID to the frontend
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create order. Please try again.",
        });
    }
});


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

//Categories

app.get("/category/sports-equipment",async (req,res)=>{
    const products = await Products.find({ category: "sports-equipment" });
    const category="SPORTS-EQUIPMENT"
    res.render("categoryProducts.ejs",{products,category});

})

app.get("/category/apparel",async(req,res)=>{
    const products = await Products.find({ category: "apparel" });
    const category="APPAREL"
    res.render("categoryProducts.ejs",{products,category});
})

app.get("/category/footwear",async(req,res)=>{
    const products = await Products.find({ category: "footwear" });
    const category="FOOTWEAR"
    res.render("categoryProducts.ejs",{products,category});
})

app.get("/category/accessories",async(req,res)=>{
    const products = await Products.find({ category: "sports-equipment" });
    const category="ACCESSORIES"
    res.render("categoryProducts.ejs",{products,category});
})

//Reviews
//adding a new review
app.post("/products/:id/review", async(req,res)=>{
    let product = await Product.findById(req.params.id);
    // console.log(req.body.review);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    product.reviews.push(newReview);
    await newReview.save();
    await product.save();
    // console.log(listing);
    req.flash("success","New review created!");
    res.redirect(`/products/${product._id}`);
});
//deleting reviews
app.delete("/products/:id/reviews/:reviewId", async(req,res)=>{
    let { id, reviewId} = req.params;
    await Product.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review successfully deleted!");
    res.redirect(`/products/${id}`);
})

app.listen(8080, (req, res) => {
    console.log("Listening on port 8080");
})