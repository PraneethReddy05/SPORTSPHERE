const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Products = require("./models/Products.js");
const User = require("./models/Users.js");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
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

//middleware for passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//home route
app.get("/home", async (req, res) => {
    res.send("home to be implemented")
})

//view all products
app.get("/products", async (req, res) => {
    const allProducts = await Products.find({});
    res.render("home.ejs", { allProducts });
})

//product details
app.get("/products/:id", async (req, res) => {
    let { id } = req.params;
    let product = await Products.findById(id);
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

// cart
app.get("/cart", (req, res) => {
    res.send("Cart of the respective user");
})

app.post("/signup/user", async (req, res) => {
    try {
        // console.log("Signup data: ", req.body);

        let { username,name, email, phone, street, pincode, city, state, password } = req.body;
        let newUser = new User ({ username,name, email, phone, address: { street, pincode, city, state } });
        // console.log(newUser);
        const registeredUser=await User.register(newUser, password);
        req.login(registeredUser,(err)=>{
            if(err){
                console.log(err);
            }
            res.redirect("/home");
        })
    }catch(err){
        console.log(err);
    }
})

app.post("/login/user",passport.authenticate("local",{failureRedirect:'/login'}),async(req,res)=>{
    res.redirect("/home");
})



app.listen(8080, (req, res) => {
    console.log("Listening on port 8080");
})