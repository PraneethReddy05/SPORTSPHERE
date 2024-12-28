const express=require("express");
const mongoose=require("mongoose");
const app=express();
const ejs=require("ejs");
const path=require("path");
const methodOverride =require("method-override");
const ejsMate=require("ejs-mate");
const Products=require("/Users/abhishekalli/Documents/SPORTSPHERE/models/Products.js");
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

app.get("/",async (req,res)=>{
    const allProducts=await Products.find({});
    console.log(allProducts);
    res.render("home.ejs",{allProducts});
})


app.listen(8080,(req,res)=>{
    console.log("Listening on port 8080");
})