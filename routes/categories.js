const express = require("express");
const router = express.Router();
const Products = require("../models/Products.js");

//Categories

router.get("/sports-equipment",async (req,res)=>{
    const products = await Products.find({ category: "sports-equipment" });
    const category="SPORTS-EQUIPMENT"
    res.render("categoryProducts.ejs",{products,category});
})

router.get("/apparel",async(req,res)=>{
    const products = await Products.find({ category: "apparel" });
    const category="APPAREL"
    res.render("categoryProducts.ejs",{products,category});
})

router.get("/footwear",async(req,res)=>{
    const products = await Products.find({ category: "footwear" });
    const category="FOOTWEAR"
    res.render("categoryProducts.ejs",{products,category});
})

router.get("/accessories",async(req,res)=>{
    const products = await Products.find({ category: "sports-equipment" });
    const category="ACCESSORIES"
    res.render("categoryProducts.ejs",{products,category});
})

module.exports = router;