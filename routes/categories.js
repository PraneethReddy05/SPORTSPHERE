const express = require("express");
const router = express.Router();
const Products = require("../models/Products.js");
const WrapAsync = require("../utils/WrapAsync.js");
//Categories

router.get("/sports-equipment",WrapAsync(async (req,res)=>{
    const products = await Products.find({ category: "sports-equipment" });
    const category="SPORTS-EQUIPMENT"
    res.render("categoryProducts.ejs",{products,category});
}));

router.get("/apparel",WrapAsync(async(req,res)=>{
    const products = await Products.find({ category: "apparel" });
    const category="APPAREL"
    res.render("categoryProducts.ejs",{products,category});
}));

router.get("/footwear",WrapAsync(async(req,res)=>{
    const products = await Products.find({ category: "footwear" });
    const category="FOOTWEAR"
    res.render("categoryProducts.ejs",{products,category});
}));

router.get("/accessories",WrapAsync(async(req,res)=>{
    const products = await Products.find({ category: "sports-equipment" });
    const category="ACCESSORIES"
    res.render("categoryProducts.ejs",{products,category});
}));

router.get("/fitness-gear",WrapAsync(async(req,res)=>{
    const products = await Products.find({ category: "fitness-gear" });
    const category="FITNESS_GEAR"
    res.render("categoryProducts.ejs",{products,category});
}));
router.get("/outdoor-sports",WrapAsync(async(req,res)=>{
    const products = await Products.find({ category: "outdoor-sports" });
    const category="OUTDOOR SPORTS"
    res.render("categoryProducts.ejs",{products,category});
}));

module.exports = router;