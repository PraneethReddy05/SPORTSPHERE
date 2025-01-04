const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ejs=require("ejs");
const path=require("path");
const methodOverride =require("method-override");
const ejsMate=require("ejs-mate");
const Products=require("./models/Products.js");
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/SPORTSPHERE")
}

main().then(()=>{
    console.log("Connected to DB");
}).catch(err=>{
    console.log(err);
})


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//home route
app.get("/home",async (req,res)=>{
    res.send("home to be implemented")
})

//view all products
app.get("/products",async(req,res)=>{
    const allProducts=await Products.find({});
    res.render("home.ejs",{allProducts});
})

//product details
app.get("/products/:id", async (req,res)=>{
    let {id} = req.params;
    let product = await Products.findById(id);
    res.render("details.ejs",{product});
})

//contact
app.get("/contact",(req,res)=>{
    res.send("Contact page");
})

//about us
app.get("/about",(req,res)=>{
    res.send("About us page");
})


//signup //user
app.get("/signup/user",(req,res)=>{
    res.render("users/signup.ejs")
})
//signup //seller
app.get("/signup/seller",(req,res)=>{
    res.render("sellers/signup.ejs")
})

//login //user
app.get("/login/user",(req,res)=>{
    res.render("users/login.ejs")
})
//login //seller
app.get("/login/seller",(req,res)=>{
    res.render("sellers/login.ejs")
})



app.listen(8080,(req,res)=>{
    console.log("Listening on port 8080");
})