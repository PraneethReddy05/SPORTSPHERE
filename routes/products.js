const express = require("express");
const router = express.Router();
const Products = require("../models/Products.js");
const Review = require("../models/Reviews.js");


//view all products
router.get("/", async (req, res) => {
    const allProducts = await Products.find({});
    res.render("products.ejs", { allProducts });
})

//product details
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    let product = await Products.findById(id).populate({path:"reviews",populate:{path:"author"}});
    res.render("details.ejs", { product });
})

//edit product
router.get("/:productId/edit",async(req,res)=>{
    let {productId}=req.params;
    // console.log(productId);
    let product= await Products.findById(productId);
    // console.log(product);
    res.render("sellers/edit.ejs",{product});
});

//edit product post
router.put("/:productId/edit",async (req,res)=>{
    let {productId}=req.params;
    await Products.findByIdAndUpdate(productId,{...req.body.product});
    res.redirect("/seller/dashboard");
})

//product delete
router.delete("/:productId",async(req,res)=>{
    let {productId}=req.params;
    await Products.findByIdAndDelete(productId);
    res.redirect("/seller/dashboard");
})

module.exports = router;